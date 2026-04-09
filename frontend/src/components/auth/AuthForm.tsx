import { useState } from "react";

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
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        maxWidth: "420px",
        margin: "0 auto",
        padding: "24px",
        background: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
      }}
    >
      <h2 style={{ margin: 0 }}>
        {isRegister ? "Create account" : "Login"}
      </h2>

      {isRegister && (
        <div>
          <label
            htmlFor="name"
            style={{ display: "block", marginBottom: "6px" }}
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter your name"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
            }}
          />
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          style={{ display: "block", marginBottom: "6px" }}
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Enter your email"
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
          }}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          style={{ display: "block", marginBottom: "6px" }}
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder="Enter your password"
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
          }}
        />
      </div>

      {error && (
        <div
          style={{
            color: "#b91c1c",
            background: "#fee2e2",
            padding: "10px 12px",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        style={{
          padding: "12px 16px",
          borderRadius: "8px",
          border: "none",
          background: "#2563eb",
          color: "#ffffff",
          cursor: "pointer",
          opacity: isLoading ? 0.7 : 1,
        }}
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