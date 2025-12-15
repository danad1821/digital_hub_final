// AdminLogin.tsx
"use client";
import { useState } from "react";
import { Lock, Mail, LogIn, Loader, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Define the shape of the data
interface LoginData {
  email: string;
  password: string;
}

export default function AdminLogin() {
    const router = useRouter();
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.id]: e.target.value,
    });
    // Clear global error on change
    if (error) setError("");
  };

  const validateForm = (data: LoginData): boolean => {
    if (!data.email.trim() || !data.password.trim()) {
      setError("Please enter both email and password.");
      return false;
    }
    // Basic email format check can be added here if needed, 
    // but the backend will handle the final, secure validation.
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm(loginData)) {
      setStatus("error"); // Set status to error to display the message
      return;
    }

    setStatus("loading");

    try {
      // POST request to your Next.js API route
      const response = await axios.post("/api/users/login", loginData);

      if (response.status === 200) {
        setStatus("success");
        // Optional: Redirect the user after successful login
        router.push("/admin/home");
      }
    } catch (err) {
      console.error(err);
      
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (axios.isAxiosError(err) && err.response) {
        // Attempt to get the detailed error message from the server response body
        // This will often contain the 'Invalid credentials' error message
        const serverError = err.response.data as { error?: string };
        if (serverError.error) {
          errorMessage = serverError.error;
        } else {
          errorMessage = `Request failed with status ${err.response.status}.`;
        }
      }

      setError(errorMessage);
      setStatus("error");
    }
  };

  const renderLoginInput = (
    label: string,
    id: keyof LoginData, // Use keyof LoginData for type safety
    type: string,
    placeholder: string,
    Icon: React.ElementType
  ) => (
    <div className="relative mb-6">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center bg-white rounded-sm border border-gray-300 focus-within:ring-2 focus-within:ring-[#00D9FF]">
        <span className="p-3 text-gray-400">
          <Icon className="w-5 h-5" />
        </span>
        <input
          type={type}
          id={id}
          value={loginData[id]} // State binding
          onChange={handleChange} // Change handler
          placeholder={placeholder}
          required
          className="flex-1 p-3 bg-transparent outline-none text-gray-800 placeholder-gray-500 rounded-sm"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-sm my-4 p-6 shadow-lg w-md min-w-[320px] max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Admin Login
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {renderLoginInput(
          "Email Address",
          "email",
          "email",
          "admin@example.com",
          Mail
        )}

        {renderLoginInput(
          "Password",
          "password",
          "password",
          "Enter your password",
          Lock
        )}

        {/* Status/Error Messages */}
        {status === "error" && (
          <div className="flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            <XCircle className="w-5 h-5 mr-2" />
            <span>{error || "Login failed."}</span>
          </div>
        )}

        {status === "success" && (
          <div className="flex items-center p-3 text-sm text-green-700 bg-green-100 rounded-lg">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>Login successful! Redirecting...</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="w-full flex items-center justify-center px-6 py-3 border cursor-pointer border-transparent text-base font-medium rounded-sm text-[#0A1C30] bg-[#00D9FF] hover:bg-[#00D9FF]/50 transition duration-300 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5 mr-2" />
              Log In
            </>
          )}
        </button>
      </form>
    </div>
  );
}