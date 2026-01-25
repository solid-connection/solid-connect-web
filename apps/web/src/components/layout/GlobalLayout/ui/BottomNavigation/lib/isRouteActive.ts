const isRouteActive = (pathname: string | null, route: string): boolean => {
  const isActive = pathname === route || pathname?.startsWith(`${route}/`);
  return !!isActive;
};
export default isRouteActive;
