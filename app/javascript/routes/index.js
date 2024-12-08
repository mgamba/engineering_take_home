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
        path: '/buildingList',
        element: <BuildingList />
      },
      {
        path: '/newBuilding',
        element: <NewBuilding />,
      },
      {
        path: '/buildingForm',
        element: <BuildingForm />,
      },
      {
        path: '/building-detail/:id',
        element: <Building />
      }
    ]
  }
])
