import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";

// Components
import ErrorPage from './error-page';
import Home from './components/Home';
import Login from './components/Login'
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />,
        loader: () => {

          return null
        },
        children: [
          {
            path: "",
            element: <Dashboard />
          },
          {
            path: "profile",
            element: <Profile />
          }
        ]
      },
      {
        path: "login",
        element: <Login />
      }
    ],
  },
])
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
