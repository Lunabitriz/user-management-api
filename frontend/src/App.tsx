import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import UserAccount from './pages/UserAccount';
import AppProviders from './layouts/AppProviders';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './routes/ProtectedRoute';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter(
  [{
    element: <AppProviders />,
    children: [
      {
        path: '/',
        element: <LoginPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/account', element: <UserAccount /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  }],
  {
    future: {
      v7_fetcherPersist: true,
      v7_startTransition: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_normalizeFormMethod: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);

const App = () => <RouterProvider router={router} />;

export default App;
