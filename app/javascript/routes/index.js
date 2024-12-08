import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import BuildingList from "../components/BuildingList";
import NewBuilding from "../components/NewBuilding";
import BuildingForm from "../components/BuildingForm";
import Building from "../components/Building";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: '/buildings',
        element: <BuildingList />
      },
      {
        path: '/buildings/new',
        element: <NewBuilding />,
      },
      {
        path: '/buildings/edit',
        element: <BuildingForm />,
      },
      {
        path: '/buildings/:id',
        element: <Building />
      }
    ]
  }
])
