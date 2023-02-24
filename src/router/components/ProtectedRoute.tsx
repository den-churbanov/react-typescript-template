import React, { FC, ReactElement, useEffect } from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks';

type ProtectedRouteProps = { children: ReactElement };

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {

  // const { permissions } = useAuthorization();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // const match = permissions.find(permission => matchPath(permission.path, pathname));

  // useDocumentTitle(match?.name);

  // useEffect(() => !match && navigate(Paths.accessDenied, { replace: true }), [match])

  // return match ? children : null;
  return children;
}

export const withAuthorization = (component: ReactElement) => {
  return (
    <ProtectedRoute>
      {component}
    </ProtectedRoute>
  )
}