'use client';

import React, { createContext, useContext, useMemo } from 'react';
import NextLink from 'next/link';
import { useRouter as useNextRouter, usePathname, useSearchParams as useNextSearchParams } from 'next/navigation';

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

export function Link({
  to,
  href,
  children,
  className,
  onClick,
  ...props
}: any) {
  const { basePath } = useContext(RouteContext);
  const target = href || to || '';
  const finalHref = normalizeHref(target, basePath);

  return (
    <NextLink href={finalHref} className={className} onClick={onClick} {...props}>
      {children}
    </NextLink>
  );
}

export function NavLink({
  to,
  href,
  children,
  className,
  ...props
}: any) {
  const { basePath } = useContext(RouteContext);
  const pathname = usePathname();
  const target = href || to || '';
  const finalHref = normalizeHref(target, basePath);
  const isActive = pathname === finalHref || (finalHref !== basePath && pathname?.startsWith(finalHref));

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

export function useNavigate() {
  const router = useNextRouter();
  const { basePath } = useContext(RouteContext);

  return (to: string | number, options?: any) => {
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

export function useLocation() {
  const pathname = usePathname();
  const searchParams = useNextSearchParams();
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
  const nextParams = useNextSearchParams();
  const router = useNextRouter();
  const pathname = usePathname();
  const searchParams = useMemo(() => new URLSearchParams(nextParams?.toString() || ''), [nextParams]);

  const setSearchParams = (params: any) => {
    const sp = new URLSearchParams(params);
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

export function Routes({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) {
  return <>{children}</>;
}

export function Route({ element, children }: { element?: React.ReactNode; children?: React.ReactNode; path?: string; index?: boolean }) {
  return <>{element || children}</>;
}

