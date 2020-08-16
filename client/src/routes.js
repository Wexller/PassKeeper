import React from 'react';
import {AuthPage} from './pages/AuthPage';
import InnerPage from './pages/InnerPage';

export const useRoutes = isAuthenticated => {
  if (isAuthenticated) {
    return <InnerPage />
  }

  return <AuthPage />
}