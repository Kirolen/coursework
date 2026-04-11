import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import AuthForm from "../../components/auth/AuthForm/AuthForm";
import { authApi } from "../../api/auth.api";
import { useAuth } from "../../hooks/useAuth";
import "./RegisterPage.css";

function RegisterPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthLoading && isAuthenticated) {
    return <Navigate to="/characters" replace />;
  }

  const handleSubmit = async (values: {
    name?: string;
    email: string;
    password: string;
  }) => {
    try {
      setError(null);
      setIsSubmitting(true);

      const response = await authApi.register({
        name: values.name ?? "",
        email: values.email,
        password: values.password,
      });

      login(response);
      navigate("/characters");
    } catch (err: unknown) {
      let message = "Registration failed";

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
          mode="register"
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          error={error}
        />

        <p className="auth-page__footer">
          Already have an account?{" "}
          <Link className="auth-page__link" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;