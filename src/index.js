import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import XMLValidatorPage from './View/XMLValidatorView';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import UserPage from './View/UsersView';
import UserAdministrationPage from './components/UserAdministration';

const App = () => {
  useEffect(() => {
    i18n.loadNamespaces(['common'], () => {
      const root = document.getElementById('root');
      const rootContainer = createRoot(root);
      rootContainer.render(
        <I18nextProvider i18n={i18n}>
          <XMLValidatorPage />
        </I18nextProvider>
      );
    });
  }, []);

  return null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <XMLValidatorPage />,
  },
  {
    path: "/user",
    element: <UserPage />,
  },
  {
    path: "/useradministrate",
    element: <UserAdministrationPage />,
  },
]);

const root = document.getElementById('root');
const rootContainer = createRoot(root);
rootContainer.render(<App />);
rootContainer.render(<RouterProvider router={router} />);