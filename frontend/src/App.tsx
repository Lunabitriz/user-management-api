import './App.css'

import LoginPage from './pages/LoginPage'
import UserAccount from './pages/UserAccount'
import ForgotPassword from './pages/ForgotPassword'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter(
  [{
      path: '/',
      element: <LoginPage />
    },
    {
      path: '/account',
      element: <UserAccount />
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />
    },
    // { Implementarei futuramente!
    //   path: '*',
    //   element: <NotFound />
    // },
  ],
  {
    future: {
      v7_fetcherPersist:              true,
      v7_startTransition:             true,
      v7_partialHydration:            true,
      v7_relativeSplatPath:           true,
      v7_normalizeFormMethod:         true,
      v7_skipActionErrorRevalidation: true,
    },
  }
)

const App = () => (
  <RouterProvider router={router} />
);
  
export default App