import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import AuthForm from "../../components/auth/AuthForm/AuthForm";
import { authApi } from "../../api/auth.api";
import { useAuth } from "../../hooks/useAuth";
import "./LoginPage.css";

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
    <div className="auth-page">
      <div className="auth-page__content">
        <AuthForm
          mode="login"
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          error={error}
        />

        <p className="auth-page__footer">
          No account yet?{" "}
          <Link className="auth-page__link" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;