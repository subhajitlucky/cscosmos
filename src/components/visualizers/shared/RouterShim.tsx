'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import { useRouter as useNextRouter, usePathname } from 'next/navigation';

export interface RouteContextType {
  basePath: string;
  params?: Record<string, string>;
}

export const RouteContext = createContext<RouteContextType>({ basePath: '' });

export function RouteProvider({
  basePath,
  params = {},
  children,
}: {
  basePath: string;
  params?: Record<string, string>;
  children: React.ReactNode;
}) {
  return (
    <RouteContext.Provider value={{ basePath, params }}>
      {children}
    </RouteContext.Provider>
  );
}

export function normalizeHref(to: string | number | undefined, basePath: string): string {
  if (typeof to === 'number') return '';
  if (!to) return basePath || '/';
  if (to.startsWith('http://') || to.startsWith('https://') || to.startsWith('mailto:') || to.startsWith('#')) {
    return to;
  }
  if (basePath && to.startsWith(basePath)) {
    return to;
  }
  if (to === '/') {
    return basePath || '/';
  }
  if (to.startsWith('/')) {
    return `${basePath}${to}`;
  }
  return `${basePath}/${to}`;
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  href?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLAnchorElement>;
}

export function Link({
  to,
  href,
  children,
  className,
  onClick,
  ref,
  ...props
}: LinkProps) {
  const { basePath } = useContext(RouteContext);
  const target = href || to || '';
  const finalHref = normalizeHref(target, basePath);

  return (
    <NextLink ref={ref} href={finalHref} className={className} onClick={onClick} {...props}>
      {children}
    </NextLink>
  );
}

export interface NavLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> {
  to?: string;
  href?: string;
  className?: string | ((props: { isActive: boolean; isPending: boolean }) => string | undefined);
  children?: React.ReactNode | ((props: { isActive: boolean }) => React.ReactNode);
}

export function NavLink({
  to,
  href,
  children,
  className,
  ...props
}: NavLinkProps) {
  const { basePath } = useContext(RouteContext);
  const pathname = usePathname();
  const target = href || to || '';
  const finalHref = normalizeHref(target, basePath);
  const isActive = pathname === finalHref || (finalHref !== basePath && (pathname?.startsWith(finalHref) ?? false));

  const resolvedClass =
    typeof className === 'function'
      ? className({ isActive, isPending: false })
      : className;

  return (
    <NextLink href={finalHref} className={resolvedClass} {...props}>
      {typeof children === 'function' ? children({ isActive }) : children}
    </NextLink>
  );
}

export interface NavigateOptions {
  replace?: boolean;
  state?: unknown;
}

export function useNavigate() {
  const router = useNextRouter();
  const { basePath } = useContext(RouteContext);

  return (to: string | number, options?: NavigateOptions) => {
    if (typeof to === 'number') {
      if (to === -1) router.back();
      return;
    }
    const finalHref = normalizeHref(to, basePath);
    if (options?.replace) {
      router.replace(finalHref);
    } else {
      router.push(finalHref);
    }
  };
}

/**
 * Reads the query string WITHOUT calling Next's `useSearchParams()` during render.
 *
 * That hook makes Next.js bail out of static generation for the entire route and
 * emit the nearest Suspense fallback in place of the page: /tsviz/problems and
 * /vuecosmos/learn were pre-rendering as a bare "Loading..." with none of their
 * content in the HTML. Reading `window.location.search` after mount keeps every
 * consumer statically renderable, and deep links still apply once hydrated.
 */
function useClientSearch(): URLSearchParams {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const sync = () => setSearch(window.location.search);
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  return useMemo(() => new URLSearchParams(search), [search]);
}

export function useLocation() {
  const pathname = usePathname();
  const searchParams = useClientSearch();
  return {
    pathname: pathname || '',
    search: searchParams?.toString() ? `?${searchParams.toString()}` : '',
    hash: '',
    state: null,
    key: 'default',
  };
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  const { params } = useContext(RouteContext);
  return (params || {}) as T;
}

export function useSearchParams() {
  const router = useNextRouter();
  const pathname = usePathname();
  const searchParams = useClientSearch();

  const setSearchParams = (params: Record<string, string> | string | URLSearchParams) => {
    const sp = new URLSearchParams(params as Record<string, string>);
    router.replace(`${pathname}?${sp.toString()}`);
  };

  return [searchParams, setSearchParams] as const;
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate(to, { replace });
  }, [navigate, to, replace]);
  return null;
}

export function Outlet({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export function BrowserRouter({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}
export const Router = BrowserRouter;
export const HashRouter = BrowserRouter;
export const MemoryRouter = BrowserRouter;

export function Routes({ children }: { children?: React.ReactNode; [key: string]: unknown }) {
  return <>{children}</>;
}

export function Route({ element, children }: { element?: React.ReactNode; children?: React.ReactNode; path?: string; index?: boolean }) {
  return <>{element || children}</>;
}

