export interface ElectronConfig {
  allowedRoutes: string[];
  redirectRoute: string;
}

export const electronConfig: ElectronConfig = {
  // Only auth and dashboard routes are allowed in electron
  allowedRoutes: [
    '/auth',
    '/auth/login',
    '/auth/register',
    '/dashboard',
    '/dashboard/admin',
    '/dashboard/verify',
    '/dashboard/settings',
    '/dashboard/upload',
    '/dashboard/profile',
    '/dashboard/history',
    '/dashboard/scan',
    // Add any other dashboard sub-routes as needed
  ],
  redirectRoute: '/auth/login', // Default redirect for unauthorized routes
};

export const isRouteAllowedInElectron = (pathname: string): boolean => {
  // Check if the current route is allowed in electron
  return electronConfig.allowedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
};

export const getElectronRedirectRoute = (): string => {
  return electronConfig.redirectRoute;
}; 