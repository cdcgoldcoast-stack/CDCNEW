"use client";

import NextLink from "next/link";
import {
  useParams as useNextParams,
  usePathname,
  useRouter,
} from "next/navigation";
import {
  type AnchorHTMLAttributes,
  type PropsWithChildren,
  type ReactNode,
  useEffect,
} from "react";

type To = string;

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: To;
  replace?: boolean;
  state?: unknown;
};

export function Link({ to, children, replace, ...rest }: PropsWithChildren<LinkProps>) {
  return (
    <NextLink href={to} replace={replace} {...rest}>
      {children}
    </NextLink>
  );
}

export function NavLink(props: PropsWithChildren<LinkProps>) {
  return <Link {...props} />;
}

type NavigateOptions = {
  replace?: boolean;
  state?: unknown;
};

export function useNavigate() {
  const router = useRouter();

  return (to: To, options: NavigateOptions = {}) => {
    if (options.replace) {
      router.replace(to);
      return;
    }
    router.push(to);
  };
}

export function useLocation() {
  const pathname = usePathname() || "/";
  const searchString =
    typeof window !== "undefined" ? window.location.search.replace(/^\?/, "") : "";
  const hash =
    typeof window !== "undefined" && window.location.hash ? window.location.hash : "";

  return {
    pathname,
    search: searchString ? `?${searchString}` : "",
    hash,
    state: null,
    key: `${pathname}${searchString}`,
  };
}

export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>() {
  const params = useNextParams() as Record<string, string | string[] | undefined>;
  const normalized: Record<string, string | undefined> = {};

  for (const [key, value] of Object.entries(params || {})) {
    normalized[key] = Array.isArray(value) ? value[0] : value;
  }

  return normalized as T;
}

type NavigateProps = {
  to: To;
  replace?: boolean;
  state?: unknown;
};

export function Navigate({ to, replace = false }: NavigateProps) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, replace, to]);

  return null;
}

type BrowserRouterProps = {
  children: ReactNode;
};

export function BrowserRouter({ children }: BrowserRouterProps) {
  return <>{children}</>;
}

type RoutesProps = {
  children: ReactNode;
};

export function Routes({ children }: RoutesProps) {
  return <>{children}</>;
}

type RouteProps = {
  element?: ReactNode;
};

export function Route({ element = null }: RouteProps) {
  return <>{element}</>;
}
