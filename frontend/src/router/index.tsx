import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CharactersPage from "../pages/CharactersPage";
import CreateCharacterPage from "../pages/CreateCharacterPage";
import CreateFromPromptPage from "../pages/CreateFromPromptPage";
import CharacterDetailsPage from "../pages/CharacterDetailsPage";
import EditCharacterPage from "../pages/EditCharacterPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/characters" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "characters",
        element: <CharactersPage />,
      },
      {
        path: "characters/create",
        element: <CreateCharacterPage />,
      },
      {
        path: "characters/create-from-prompt",
        element: <CreateFromPromptPage />,
      },
      {
        path: "characters/:id",
        element: <CharacterDetailsPage />,
      },
      {
        path: "characters/:id/edit",
        element: <EditCharacterPage />,
      },
    ],
  },
]);