import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";
import { authApi } from "../api/auth.api";
import { useAuth } from "../hooks/useAuth";

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: {
    name?: string;
    email: string;
    password: string;
  }) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authApi.register({
        name: values.name ?? "",
        email: values.email,
        password: values.password,
      });

      login(response);
      navigate("/characters");
        } catch (err: unknown) {
      let message = "Registration failed";

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err
      ) {
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
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px 16px" }}>
      <AuthForm
        mode="register"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />

      <p style={{ textAlign: "center", marginTop: "16px" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default RegisterPage;