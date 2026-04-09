import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";
import { authApi } from "../api/auth.api";
import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/characters" replace />;
  }

  const handleSubmit = async (values: {
    email: string;
    password: string;
  }) => {
    try {
      setError(null);
      setIsSubmitting(true);

      const response = await authApi.login({
        email: values.email,
        password: values.password,
      });

      login(response);
      navigate("/characters");
    } catch (err: unknown) {
      let message = "Login failed";

      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        message = axiosError.response?.data?.message ?? message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "40px 16px" }}>
      <AuthForm
        mode="login"
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        error={error}
      />

      <p style={{ textAlign: "center", marginTop: "16px" }}>
        No account yet? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default LoginPage;