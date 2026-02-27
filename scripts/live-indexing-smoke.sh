#!/usr/bin/env bash
set -euo pipefail

CANONICAL_ORIGIN="${CANONICAL_ORIGIN:-https://www.cdconstruct.com.au}"
NON_CANONICAL_ORIGIN="${NON_CANONICAL_ORIGIN:-https://cdconstruct.com.au}"

normalize_url() {
  local input="$1"
  if [[ "$input" == */ ]]; then
    echo "${input%/}"
  else
    echo "$input"
  fi
}

resolve_location() {
  local input="$1"
  if [[ "$input" == http://* || "$input" == https://* ]]; then
    echo "$input"
    return
  fi
  if [[ "$input" == /* ]]; then
    echo "${CANONICAL_ORIGIN}${input}"
    return
  fi
  echo "$input"
}

extract_status_code() {
  awk '/^HTTP/{code=$2} END{print code}'
}

extract_location() {
  awk -F': ' 'tolower($1)=="location"{print $2}' | tr -d '\r' | tail -n1
}

assert_code() {
  local actual="$1"
  local expected="$2"
  local label="$3"
  if [[ "$actual" != "$expected" ]]; then
    echo "[live-check] FAIL: ${label} expected ${expected}, got ${actual}"
    exit 1
  fi
  echo "[live-check] PASS: ${label} -> ${actual}"
}

assert_redirect_status() {
  local status="$1"
  local label="$2"
  local allow_temporary="${3:-false}"

  if [[ "$status" == "301" || "$status" == "308" ]]; then
    echo "[live-check] PASS: ${label} status -> ${status}"
    return
  fi

  if [[ "$allow_temporary" == "true" && "$status" == "307" ]]; then
    echo "[live-check] WARN: ${label} is temporary (307). Consider a permanent 308 redirect."
    return
  fi

  echo "[live-check] FAIL: ${label} expected 301/308, got ${status}"
  exit 1
}

assert_redirect_location() {
  local actual="$1"
  local expected="$2"
  local label="$3"
  local resolved_actual
  resolved_actual="$(resolve_location "$actual")"
  if [[ "$(normalize_url "$resolved_actual")" != "$(normalize_url "$expected")" ]]; then
    echo "[live-check] FAIL: ${label} expected location ${expected}, got ${actual}"
    exit 1
  fi
  echo "[live-check] PASS: ${label} location -> ${resolved_actual}"
}

echo "[live-check] Checking canonical metadata endpoints..."
robots_code="$(curl -sS -o /dev/null -w "%{http_code}" "${CANONICAL_ORIGIN}/robots.txt")"
sitemap_code="$(curl -sS -o /dev/null -w "%{http_code}" "${CANONICAL_ORIGIN}/sitemap.xml")"
assert_code "$robots_code" "200" "robots.txt"
assert_code "$sitemap_code" "200" "sitemap.xml"

echo "[live-check] Checking canonical redirect hygiene..."
legacy_headers="$(curl -sS -I "${CANONICAL_ORIGIN}/projects")"
legacy_status="$(printf "%s\n" "$legacy_headers" | extract_status_code)"
legacy_location="$(printf "%s\n" "$legacy_headers" | extract_location)"
assert_redirect_status "$legacy_status" "legacy /projects redirect"
assert_redirect_location "$legacy_location" "${CANONICAL_ORIGIN}/renovation-projects" "legacy /projects redirect"

echo "[live-check] Checking host canonicalization with query preservation..."
sample_path="/renovation-projects/family-hub?utm_source=indexing-smoke&utm_medium=ci"
host_headers="$(curl -sS -I "${NON_CANONICAL_ORIGIN}${sample_path}")"
host_status="$(printf "%s\n" "$host_headers" | extract_status_code)"
host_location="$(printf "%s\n" "$host_headers" | extract_location)"
assert_redirect_status "$host_status" "non-canonical host redirect" "true"
assert_redirect_location "$host_location" "${CANONICAL_ORIGIN}${sample_path}" "non-canonical host redirect"

echo "[live-check] Checking redirect hop count..."
legacy_hops="$(curl -sS -o /dev/null -w "%{num_redirects}" -L "${CANONICAL_ORIGIN}/projects")"
host_hops="$(curl -sS -o /dev/null -w "%{num_redirects}" -L "${NON_CANONICAL_ORIGIN}${sample_path}")"

if [[ "$legacy_hops" != "1" ]]; then
  echo "[live-check] FAIL: /projects should redirect in 1 hop, got ${legacy_hops}"
  exit 1
fi
if [[ "$host_hops" != "1" ]]; then
  echo "[live-check] FAIL: host canonicalization should redirect in 1 hop, got ${host_hops}"
  exit 1
fi

echo "[live-check] PASS: redirect hop counts are single-hop"
echo "[live-check] All production indexing smoke checks passed."
