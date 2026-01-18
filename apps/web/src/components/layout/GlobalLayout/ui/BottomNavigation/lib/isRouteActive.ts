const isRouteActive = (pathname: string | null, route: string): boolean => {
  const isActive = pathname === route || pathname?.startsWith(route + "/");
  return isActive ? true : false;
};
export default isRouteActive;
