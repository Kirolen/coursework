import { useState } from "react";
import "./AuthForm.css";

interface AuthFormValues {
  name?: string;
  email: string;
  password: string;
}

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (values: AuthFormValues) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

function AuthForm({
  mode,
  onSubmit,
  isLoading = false,
  error = null,
}: AuthFormProps) {
  const [formData, setFormData] = useState<AuthFormValues>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (field: keyof AuthFormValues, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(formData);
  };

  const isRegister = mode === "register";

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-form__header">
        <h2 className="auth-form__title">
          {isRegister ? "Create account" : "Login"}
        </h2>
        <p className="auth-form__subtitle">
          {isRegister
            ? "Create a new account to start managing character cards."
            : "Log in to continue working with your characters."}
        </p>
      </div>

      {isRegister && (
        <div className="auth-form__field">
          <label className="auth-form__label" htmlFor="name">
            Name
          </label>
          <input
            className="auth-form__input"
            id="name"
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter your name"
          />
        </div>
      )}

      <div className="auth-form__field">
        <label className="auth-form__label" htmlFor="email">
          Email
        </label>
        <input
          className="auth-form__input"
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Enter your email"
        />
      </div>

      <div className="auth-form__field">
        <label className="auth-form__label" htmlFor="password">
          Password
        </label>
        <input
          className="auth-form__input"
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder="Enter your password"
        />
      </div>

      {error && <div className="auth-form__error">{error}</div>}

      <button
        className="auth-form__submit"
        type="submit"
        disabled={isLoading}
      >
        {isLoading
          ? "Please wait..."
          : isRegister
          ? "Register"
          : "Login"}
      </button>
    </form>
  );
}

export default AuthForm;