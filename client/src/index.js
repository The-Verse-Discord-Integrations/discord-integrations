import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";
import ErrorPage from './error-page';
import Home from './components/Home';
import Login from './components/Login'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        // Redirect user to the homepage if they go to the base url
        path: "",
        loader: () => {
          return redirect("/home")
        }
      },
      {
        path: "home",
        element: <Home />,
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
    <RouterProvider router={router}/>
  </React.StrictMode>
);
