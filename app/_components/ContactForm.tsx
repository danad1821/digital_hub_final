"use client";
import { useState } from "react";
import {
  Mail,
  User,
  Phone,
  MessageSquare,
  Send,
  CheckCircle,
  XCircle,
  Loader,
} from "lucide-react";
import axios from "axios";

// Define the shape of the data for better type safety
interface ContactData {
  fullName: string;
  email: string;
  company: string;
  message: string;
}

// Regex for international phone numbers (flexible) and email
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function ContactForm() {
  const [contactData, setContactData] = useState<ContactData>({
    fullName: "",
    email: "",
    company: "",
    message: "",
  });
  const [error, setError] = useState<string>("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContactData({
      ...contactData,
      [e.target.id]: e.target.value,
    });
    // Clear global error on change
    if (error) setError("");
  };

  const validateForm = (data: ContactData): boolean => {
    if (!data.fullName.trim()) {
      setError("Contact Name is required.");
      return false;
    }
    if (!EMAIL_REGEX.test(data.email)) {
      setError("A valid email address is required.");
      return false;
    }
    if (!data.message.trim() || data.message.trim().length < 10) {
      setError("Message is required and must be at least 10 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm(contactData)) {
      setStatus("idle");
      return;
    }

    setStatus("loading");

    try {
      const response = await axios.post("/api/messages", contactData);

      if (response.status >= 200 && response.status < 300) {
        setStatus("success");
        setContactData({ fullName: "", email: "", company: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setError("Unexpected response status from server.");
        setStatus("error");
      }
    } catch (err) {
      console.error(err);

      let errorMessage =
        "A network error occurred or the server is unavailable.";

      if (axios.isAxiosError(err) && err.response) {
        const serverError = err.response.data as {
          details?: string;
          error?: string;
        };
        if (serverError.details) {
          errorMessage = `Server Validation Error: ${serverError.details}`;
        } else if (serverError.error) {
          errorMessage = `Server Error: ${serverError.error}`;
        } else {
          errorMessage = `Request failed with status ${err.response.status}.`;
        }
      }

      setError(errorMessage);
      setStatus("error");
    }
  };

  const renderInput = (
    label: string,
    id: keyof ContactData,
    type: string = "text",
    placeholder: string = label,
    required: boolean = true
  ) => (
    <div className="relative mb-4 sm:mb-6"> {/* Reduced margin on mobile */}
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="flex items-center bg-white rounded-sm border border-gray-300 focus-within:ring-2 focus-within:ring-[#00D9FF]">
        <input
          type={type}
          id={id}
          value={contactData[id]}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className="flex-1 p-2 sm:p-3 bg-transparent outline-none text-gray-800 placeholder-gray-500 rounded-sm text-sm sm:text-base" // Responsive padding and text size
        />
      </div>
    </div>
  );

  const renderTextarea = (
    label: string,
    id: keyof ContactData,
    placeholder: string = label,
    required: boolean = true
  ) => (
    <div className="relative mb-4 sm:mb-6"> {/* Reduced margin on mobile */}
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="flex bg-white rounded-sm border border-gray-300 focus-within:ring-2 focus-within:ring-[#00D9FF]">
        <textarea
          id={id}
          value={contactData[id]}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          rows={4}
          className="flex-1 p-2 sm:p-3 bg-transparent outline-none text-gray-800 placeholder-gray-500 rounded-sm resize-none text-sm sm:text-base" // Responsive padding and text size
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-sm my-4 w-full p-4 sm:p-6"> {/* Changed min-w-[45%] to w-full and responsive padding/shadow */}
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4"> {/* Reduced spacing on mobile */}
        {renderInput("Full Name", "fullName", "text", "John Smith")}
        {renderInput("Email Address", "email", "email", "john@company.com")}
        {renderInput(
          "Company",
          "company",
          "text",
          "Your Company Name",
          false
        )}
        {renderTextarea(
          "Project Details",
          "message",
          "Tell us about your logistics needs..."
        )}

        {/* Status/Error Messages */}
        {(status === "error" || error) && (
          <div className="flex items-start p-3 text-sm text-red-700 bg-red-100 rounded-lg"> {/* items-start for long messages */}
            <XCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{error || "Submission failed due to a server error."}</span>
          </div>
        )}

        {status === "success" && (
          <div className="flex items-start p-3 text-sm text-green-700 bg-green-100 rounded-lg"> {/* items-start for long messages */}
            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>Message sent successfully! We will be in touch shortly.</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full sm:w-fit flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 border cursor-pointer border-transparent text-sm sm:text-base font-medium rounded-sm text-[#0A1C30] bg-[#00D9FF] hover:bg-[#00D9FF]/50 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-70 hover:scale-105" // Full width on mobile, responsive padding/text size
        >
          {status === "loading" ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}