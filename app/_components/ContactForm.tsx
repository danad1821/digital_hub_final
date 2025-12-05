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
// Allows for various international formats: +1 (555) 123-4567 or 0044 1234567890 etc.


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
      // Axios automatically handles JSON serialization of the data
      const response = await axios.post("/api/messages", contactData);

      // Axios throws for 4xx/5xx status codes, so if we reach here, it's a 2xx success.
      // We check for 201 (Created) or 200 (OK)
      if (response.status >= 200 && response.status < 300) {
        setStatus("success");
        // Clear the form on successful submission
        setContactData({ fullName: "", email: "", company: "", message: "" });
        // Automatically clear success message after a few seconds
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        // This block is technically unreachable if the server returns 4xx/5xx because Axios throws
        setError("Unexpected response status from server.");
        setStatus("error");
      }
    } catch (err) {
      // This is where 4xx/5xx status codes (like the 500 error you saw) will land.
      console.error(err);

      let errorMessage =
        "A network error occurred or the server is unavailable.";

      if (axios.isAxiosError(err) && err.response) {
        // Attempt to get the detailed error message from the server response body
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
    <div className="relative mb-6">
      <label
        htmlFor={id}
        className=" text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="flex items-center bg-white rounded-sm border border-gray-300 focus-within:ring-2 focus-within:ring-[#00FFFF]">
        <input
          type={type}
          id={id}
          value={contactData[id]}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className="flex-1 p-3 bg-transparent outline-none text-gray-800 placeholder-gray-500 rounded-sm"
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
    <div className="relative mb-6">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="flex bg-white rounded-sm border border-gray-300 focus-within:ring-2 focus-within:ring-[#00FFFF]">
        <textarea
          id={id}
          value={contactData[id]}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          rows={4}
          className="flex-1 p-3 bg-transparent outline-none text-gray-800 placeholder-gray-500 rounded-sm resize-none"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-sm my-4 min-w-[45%] p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            <XCircle className="w-5 h-5 mr-2" />
            <span>{error || "Submission failed due to a server error."}</span>
          </div>
        )}

        {status === "success" && (
          <div className="flex items-center p-3 text-sm text-green-700 bg-green-100 rounded-lg">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>Message sent successfully! We will be in touch shortly.</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-1/2 flex items-center justify-center px-6 py-3 border cursor-pointer border-transparent text-base font-medium rounded-sm text-[#0A1C30] bg-[#00FFFF] hover:bg-[#00FFFF]/50 transition duration-300 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
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
