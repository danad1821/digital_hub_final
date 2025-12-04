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
  phone: string;
  message: string;
}

// Regex for international phone numbers (flexible) and email
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Allows for various international formats: +1 (555) 123-4567 or 0044 1234567890 etc.
const PHONE_REGEX =
  /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;

export default function ContactForm() {
  const [contactData, setContactData] = useState<ContactData>({
    fullName: "",
    email: "",
    phone: "",
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
    // Phone is optional but if provided, must be valid
    if (data.phone.trim() && !PHONE_REGEX.test(data.phone)) {
      setError("Please enter a valid international phone number.");
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
        setContactData({ fullName: "", email: "", phone: "", message: "" });
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
      
      let errorMessage = "A network error occurred or the server is unavailable.";
      
      if (axios.isAxiosError(err) && err.response) {
        // Attempt to get the detailed error message from the server response body
        const serverError = err.response.data as { details?: string, error?: string };
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
    Icon: React.ElementType,
    label: string,
    id: keyof ContactData,
    type: string = "text",
    placeholder: string = label,
    required: boolean = true
  ) => (
    <div className="relative mb-6">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 sr-only"
      >
        {label}
      </label>
      <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-300 focus-within:ring-2 focus-within:ring-[#FF8C00]">
        <div className="p-3 text-[#FF8C00]">
          <Icon className="w-5 h-5" />
        </div>
        <input
          type={type}
          id={id}
          value={contactData[id]}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className="flex-1 p-3 bg-transparent outline-none text-gray-800 placeholder-gray-500 rounded-r-lg"
        />
      </div>
    </div>
  );

  const renderTextarea = (
    Icon: React.ElementType,
    label: string,
    id: keyof ContactData,
    placeholder: string = label,
    required: boolean = true
  ) => (
    <div className="relative mb-6">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 sr-only"
      >
        {label}
      </label>
      <div className="flex bg-white rounded-lg shadow-sm border border-gray-300 focus-within:ring-2 focus-within:ring-[#FF8C00]">
        <div className="p-3 text-[#FF8C00] self-start mt-2">
          <Icon className="w-5 h-5" />
        </div>
        <textarea
          id={id}
          value={contactData[id]}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          rows={4}
          className="flex-1 p-3 bg-transparent outline-none text-gray-800 placeholder-gray-500 rounded-r-lg resize-none"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl max-w-lg mx-auto border-t-4 border-[#FF8C00]">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Get in Touch
      </h2>
      <p className="text-gray-500 mb-8 text-center">
        We're here to help you navigate your maritime needs.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {renderInput(
          User,
          "Contact Name",
          "fullName",
          "text",
          "Your Full Name"
        )}
        {renderInput(Mail, "Email", "email", "email", "Your Email")}
        {renderInput(
          Phone,
          "Phone Number",
          "phone",
          "tel",
          "International Phone (Optional)",
          false
        )}
        {renderTextarea(
          MessageSquare,
          "Message",
          "message",
          "Tell us about your requirements..."
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
          className="w-full flex items-center justify-center px-6 py-3 border cursor-pointer border-transparent text-base font-medium rounded-lg text-[#0A1C30] bg-[#FF8C00] hover:bg-orange-500 transition duration-300 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Send Enquiry
            </>
          )}
        </button>
      </form>
    </div>
  );
}