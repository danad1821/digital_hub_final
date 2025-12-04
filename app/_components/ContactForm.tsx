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

// Define the shape of the data for better type safety
interface ContactData {
  contactName: string;
  email: string;
  phone: string;
  message: string;
}

// Regex for international phone numbers (flexible) and email
const EMAIL_REGEX = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
// Allows for various international formats: +1 (555) 123-4567 or 0044 1234567890 etc.
const PHONE_REGEX =
  /^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$/im;

export default function ContactForm() {
  const [contactData, setContactData] = useState<ContactData>({
    contactName: "",
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
    if (!data.contactName.trim()) {
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
      // Note: This assumes you have a Next.js API route at /api/send-email
      // that uses the Resend API key securely on the server side.
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("success");
        // Clear the form on successful submission
        setContactData({ contactName: "", email: "", phone: "", message: "" });
        // Automatically clear success message after a few seconds
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        // Use the error message from the API response if available
        setError(result.error || "Failed to send message. Please try again.");
        setStatus("error");
      }
    } catch (err) {
      setError("A network error occurred. Please check your connection.");
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
          "contactName",
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
