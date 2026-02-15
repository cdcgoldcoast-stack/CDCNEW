#!/usr/bin/env bash
# Install system libraries required by Puppeteer's Chrome on Vercel (Amazon Linux 2).
# No-ops on non-Linux (macOS local dev).

set -euo pipefail

if [[ "$(uname -s)" != "Linux" ]]; then
  echo "[install-chrome-deps] Not Linux — skipping."
  exit 0
fi

echo "[install-chrome-deps] Installing Chrome system dependencies via yum..."
yum install -y -q \
  nss \
  atk \
  at-spi2-atk \
  cups-libs \
  libdrm \
  libgbm \
  libxkbcommon \
  libXcomposite \
  libXdamage \
  libXfixes \
  libXrandr \
  mesa-libgbm \
  pango \
  alsa-lib \
  xorg-x11-libs \
  2>&1 | tail -1

echo "[install-chrome-deps] Done."
