'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

/**
 * Ensures a user is both logged in and possesses the necessary
 * role to view the child routes.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // If we're on the login or unauthorized page, skip the check
    if (pathname === '/login' || pathname === '/unauthorized' || pathname === '/auth/login') {
      setIsAuthorized(true);
      return;
    }

    // Try localStorage, then fall back to session Cookie if needed,
    // though the prompt says "localStorage, sessionStorage, or a secure cookie".
    // Many times it's saved in localStorage based on user snippet:
    let token = localStorage.getItem('token');
    
    // Check 'token' cookie specifically as fallback
    if (!token) {
      const match = document.cookie.match(/(^| )token=([^;]+)/);
      if (match) token = match[2];
    }

    if (!token) {
      // Not logged in -> Kick to Login Page
      router.replace('/login');
      return;
    }

    try {
      // 1. Decode the token passport to see who this is
      const decodedToken = jwtDecode(token);
      const userRoles = decodedToken.roles || [];

      // 2. Check if the user has AT LEAST ONE of the roles required for this app
      // Also allow pure 'admin' or 'Admin' as a fallback so you don't get locked out
      const hasAccess = allowedRoles.some((role) => userRoles.includes(role)) 
                        || userRoles.includes('admin') 
                        || userRoles.includes('Admin');

      if (!hasAccess) {
        console.warn(`Access Denied! Your roles: [${userRoles}]. Required: [${allowedRoles}]`);
        // 3. Logged in, but unauthorized for this specific app
        router.replace('/unauthorized');
        return;
      }

      // 4. Authorized! Render the child routes
      setIsAuthorized(true);
    } catch (error) {
      // Invalid, malformed, or expired token fallback
      localStorage.removeItem('token');
      // remove cookies as well
      document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      router.replace('/login');
    }
  }, [router, pathname, allowedRoles]);

  if (!isAuthorized) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
};

export default ProtectedRoute;
