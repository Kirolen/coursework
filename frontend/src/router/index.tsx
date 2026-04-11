import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute/ProtectedRoute";
import MainLayout from "../layouts/MainLayout/MainLayout";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import CharactersPage from "../pages/CharactersPage/CharactersPage";
import CreateCharacterPage from "../pages/CreateCharacterPage/CreateCharacterPage";
import CreateFromPromptPage from "../pages/CreateFromPromptPage/CreateFromPromptPage";
import CharacterDetailsPage from "../pages/CharacterDetailsPage/CharacterDetailsPage";
import EditCharacterPage from "../pages/EditCharacterPage/EditCharacterPage";

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