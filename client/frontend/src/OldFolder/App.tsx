import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes";

const App: React.FC = () => {
  // App.tsx acts as the direct switcher for page delivery
  return <RouterProvider router={router} />;
};

export default App;
