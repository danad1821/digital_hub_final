// app/admin/home/page.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
// Assuming these server actions are implemented in your project at this path.
// getHomePageContent and updateHomePageContent map to getStaticPageContent and updateStaticPageContent
import { 
    getHomePageContent, 
    updateHomePageContent, 
    addPageImage // <-- NEW: Import the image upload action
} from "@/app/_actions/pages"; 
import { Ship, Loader2, Save, XCircle, Settings, Camera, Image as ImageIcon, LinkIcon, Globe, Clock, CheckCircle, CloudLightning } from "lucide-react";
import Link from "next/link"; 
import Image from "next/image"; // For displaying the image preview/current image

// --- THEME CONSTANTS ---
const PRIMARY_BG = "bg-[#0A1C30]";
const ACCENT_COLOR = "text-[#00FFFF]";
const POP_BG = "bg-[#00FFFF]";
const DARK_TEXT = "text-[#0A1C30]";
const CARD_BG = "bg-gray-900";

// Map of string names to Lucide Icons for display reference
const IconMap: { [key: string]: React.FC<any> } = {
    Globe: Globe,
    Clock: Clock,
    Ship: Ship,
    CloudLightning: CloudLightning, 
    Shield: CheckCircle, 
    Cog: Settings,
    CheckCircle: CheckCircle,
};

// Placeholder types
type HomePageData = {
    _id: string;
    slug: string;
    title: string; 
    content: string;
    headerImageId?: string | null; // <-- Crucial for image management
};

type CompanyStrength = {
    icon: string; 
    serviceName: string; 
    summary: string;
};

type EditableFields = {
    // ... all text fields from previous step
    heroTitleLine1: string; 
    heroTitleLine2: string; 
    heroSubtitle: string; 
    aboutParagraph1: string; 
    aboutParagraph2: string; 
    yearsExperience: string;
    projectsDelivered: string;
    globalPorts: string;
    whyChooseUsTitle: string; 
    whyChooseUsSubtitle: string; 
    companyStrengths: CompanyStrength[];
};

// Initial state matching the client's static content
const defaultEditableFields: EditableFields = {
    heroTitleLine1: "Moving the World's",
    heroTitleLine2: "Heaviest Cargo",
    heroSubtitle: "Expert heavy lift solutions, break bulk shipping, and project logistics delivering industrial cargo anywhere in the world.",
    aboutParagraph1: "Alta Maritime has been a trusted partner in global maritime logistics for over three decades. We specialize in moving the world's most challenging cargo—from heavy industrial machinery to complete manufacturing facilities.",
    aboutParagraph2: "Our comprehensive network spans major ports worldwide, supported by cutting-edge equipment and a team of logistics professionals who understand the complexity of break bulk and project cargo.",
    yearsExperience: "30+",
    projectsDelivered: "2000+",
    globalPorts: "45",
    whyChooseUsTitle: "Why Choose Alta Maritime",
    whyChooseUsSubtitle: "Industry-leading capabilities backed by decades of expertise",
    companyStrengths: [
        { icon: "Globe", serviceName: "Global Coverage", summary: "Strategic presence in major ports across six continents" },
        { icon: "Clock", serviceName: "On-Time Delivery", summary: "98% on-time performance with real-time tracking" },
        { icon: "Ship", serviceName: "Heavy Lift Expertise", summary: "30+ years specialized in oversized cargo handling" },
        { icon: "CloudLightning", serviceName: "Modern Fleet", summary: "State-of-the-art vessels and handling equipment" },
        { icon: "Shield", serviceName: "Safety Standards", summary: "ISO certified with zero-incident safety record" },
        { icon: "Cog", serviceName: "Expert Team", summary: "Dedicated logistics professionals available 24/7" },
    ],
};

// Common Input Component for consistent styling (reused from previous step)
const ThemedInput = ({ name, label, value, onChange, isTextarea = false, type = "text" }: any) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        {isTextarea ? (
            <textarea
                name={name}
                rows={3}
                value={value}
                onChange={onChange}
                className="mt-1 block w-full border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm p-3 focus:ring-[#00FFFF] focus:border-[#00FFFF] resize-none"
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="mt-1 block w-full border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm p-3 focus:ring-[#00FFFF] focus:border-[#00FFFF]"
            />
        )}
    </div>
);

export default function AdminHomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // <-- NEW: Upload state
  const [data, setData] = useState<HomePageData | null>(null);
  const [formData, setFormData] = useState<EditableFields>(defaultEditableFields);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [imageFile, setImageFile] = useState<File | null>(null); // <-- NEW: File state
  const [imagePreview, setImagePreview] = useState<string | null>(null); // <-- NEW: Preview state


  const fetchHomePageData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // getHomePageContent maps to getStaticPageContent("home")
      const pageData = await getHomePageContent(); 
      
      if (pageData) {
        // Ensure headerImageId is carried over
        setData(pageData as unknown as HomePageData);
        
        try {
            const parsedContent = JSON.parse(pageData.content);
            setFormData({
                ...defaultEditableFields, 
                ...parsedContent,
            });
        } catch (e) {
            console.warn("Could not parse page content as JSON. Using defaults.");
            setFormData(defaultEditableFields);
        }
      } else {
        setData(null);
        setFormData(defaultEditableFields);
      }
    } catch (e) {
      setError("Failed to fetch home page data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomePageData();
  }, [fetchHomePageData]);
  
  // Clean up preview object URL on component unmount or file change
  useEffect(() => {
    return () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // --- HANDLERS ---

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setSuccess(null); 
  };
  
  const handleStrengthChange = (index: number, field: keyof CompanyStrength, value: string) => {
    const newStrengths = [...formData.companyStrengths];
    (newStrengths[index] as any)[field] = value;
    setFormData({
        ...formData,
        companyStrengths: newStrengths,
    });
    setSuccess(null);
  };

  const handleSaveText = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const contentToSave: any = JSON.stringify(formData);
    
    try {
      // updateHomePageContent maps to updateStaticPageContent("home", ...)
      const result = await updateHomePageContent("home", "Home Page Content", contentToSave);

      if (result.success) {
        setSuccess("Home page text content updated successfully!");
      } else {
        setError(result.error || "Failed to save text content.");
      }
    } catch (e) {
      setError("An unexpected error occurred during save.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    
    if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
    }
    
    if (file) {
        setImagePreview(URL.createObjectURL(file));
    } else {
        setImagePreview(null);
    }
  };

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
        setError("Please select an image file to upload first.");
        return;
    }
    
    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
        const data = new FormData();
        data.append('image', imageFile);

        // Call the server action to handle upload, DB update, and cleanup
        const result = await addPageImage("home", data);

        if (result.success && result.fileId) {
            setSuccess("Hero image uploaded and updated successfully!");
            // Clear the local file state after successful upload
            setImageFile(null);
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
            // Re-fetch data to show the new image ID/state
            await fetchHomePageData(); 
        } else {
            setError(result.error || "Failed to upload image.");
        }
    } catch (e) {
        setError("An unexpected network or server error occurred during upload.");
    } finally {
        setIsUploading(false);
    }
  };

  // Memoized current image URL for display
  const currentImageUrl = useMemo(() => {
    if (data?.headerImageId) {
        // Use the API route to serve the image by its ID
        return `/api/images/${data.headerImageId.toString()}`;
    }
    return null;
  }, [data?.headerImageId]);


  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${PRIMARY_BG} text-white`}>
        <Loader2 className={`w-10 h-10 animate-spin mr-3 ${ACCENT_COLOR}`} />
        <p className="text-xl">Loading Home Page Editor...</p>
      </div>
    );
  }


  return (
    <main className={`min-h-screen py-10 ${PRIMARY_BG} text-white custom-container`}>
      <h1 className="text-4xl sm:text-5xl font-bold my-8 tracking-tight text-center flex items-center justify-center">
        <Ship className={`w-8 h-8 mr-3 ${ACCENT_COLOR}`} /> Admin Home Page Editor
      </h1>
      
      {error && (
        <div className="p-4 mb-6 text-red-400 bg-red-900 border border-red-700 rounded-lg flex items-center">
            <XCircle className="w-5 h-5 mr-2" /> {error}
        </div>
      )}
      {success && (
        <div className="p-4 mb-6 text-green-400 bg-green-900 border border-green-700 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" /> {success}
        </div>
      )}

      {/* --- Section 1: Hero Image & Text Management --- */}
      <section className={`p-6 my-8 ${CARD_BG} border border-gray-800 rounded-xl shadow-2xl`}>
        <h2 className="text-3xl font-bold mb-6 flex items-center border-b border-gray-700 pb-3">
          <Camera className={`w-6 h-6 mr-3 ${ACCENT_COLOR}`} /> Hero Section
        </h2>
        
        {/* IMAGE UPLOAD SUB-SECTION */}
        <div className="mb-8 border border-gray-700 p-4 rounded-lg bg-gray-800">
            <h3 className="text-xl font-bold mb-3 text-white flex items-center">
                <ImageIcon className="w-5 h-5 mr-2" /> Header Image Management
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Image Display */}
                <div className="relative h-48 w-full border-2 border-dashed border-gray-600 rounded-lg overflow-hidden">
                    {(imagePreview || currentImageUrl) ? (
                        <Image 
                            src={imagePreview || currentImageUrl!} 
                            alt="Current Hero Image Preview"
                            fill
                            className="object-cover object-center"
                            unoptimized 
                            priority={true}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            No current header image.
                        </div>
                    )}
                </div>

                {/* File Input & Upload */}
                <form onSubmit={handleImageUpload} className="space-y-4">
                    <ThemedInput 
                        type="file"
                        name="image"
                        label="Select a new image (JPG, PNG, max 50MB)"
                        onChange={handleFileChange}
                    />
                    
                    <button
                        type="submit"
                        disabled={isUploading || !imageFile}
                        className={`w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition duration-200 disabled:opacity-50`}
                    >
                        {isUploading ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                            <Save className="w-5 h-5 mr-2" />
                        )}
                        {isUploading ? "Uploading..." : `Upload New Image (${imageFile?.name || 'No file selected'})`}
                    </button>
                    <p className="text-xs text-gray-500">
                        Current Image ID: {data?.headerImageId ? data.headerImageId.substring(0, 12) + '...' : 'N/A'}
                    </p>
                </form>
            </div>
        </div>

        {/* TEXT CONTENT SUB-SECTION */}
        <form onSubmit={handleSaveText} className="space-y-6">
            <h3 className="text-xl font-bold mb-3 text-white border-t border-gray-700 pt-4">Text Content</h3>
            <ThemedInput 
                name="heroTitleLine1"
                label="Hero Title (Line 1)"
                value={formData.heroTitleLine1}
                onChange={handleTextChange}
            />
            <ThemedInput 
                name="heroTitleLine2"
                label="Hero Title (Line 2 - Colored)"
                value={formData.heroTitleLine2}
                onChange={handleTextChange}
            />
            <ThemedInput 
                name="heroSubtitle"
                label="Hero Subtitle/Mission Statement"
                value={formData.heroSubtitle}
                onChange={handleTextChange}
                isTextarea={true}
            />
            
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isSaving}
                    className={`w-full flex items-center justify-center px-4 py-3 ${POP_BG} ${DARK_TEXT} font-semibold rounded-lg shadow-lg hover:bg-[#00D1E6] transition duration-200 disabled:opacity-50`}
                >
                    {isSaving ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                        <Save className="w-5 h-5 mr-2" />
                    )}
                    {isSaving ? "Saving..." : "Save Hero Section Text"}
                </button>
            </div>
        </form>
      </section>

      {/* -------------------- SECTION: WHY CHOOSE US -------------------- */}
      <section className={`p-6 my-8 ${CARD_BG} border border-gray-800 rounded-xl shadow-2xl`}>
        <h2 className="text-3xl font-bold mb-6 flex items-center border-b border-gray-700 pb-3">
          <CheckCircle className={`w-6 h-6 mr-3 ${ACCENT_COLOR}`} /> Why Choose Us (Company Strengths)
        </h2>
        
        <form onSubmit={handleSaveText} className="space-y-6">
            <ThemedInput 
                name="whyChooseUsTitle"
                label="Section Title"
                value={formData.whyChooseUsTitle}
                onChange={handleTextChange}
            />
            <ThemedInput 
                name="whyChooseUsSubtitle"
                label="Section Subtitle"
                value={formData.whyChooseUsSubtitle}
                onChange={handleTextChange}
                isTextarea={true}
            />

            <h3 className="text-xl font-semibold pt-4 border-t border-gray-700 mb-4">Edit Strength Cards (6 items)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.companyStrengths.map((strength, index) => {
                    const IconComponent = IconMap[strength.icon] || Ship; 
                    return (
                        <div key={index} className="p-4 border border-gray-700 rounded-lg space-y-3 bg-gray-800">
                            <div className="flex items-center text-lg font-bold">
                                <IconComponent className={`w-5 h-5 mr-2 ${ACCENT_COLOR}`} /> Card {index + 1}
                            </div>
                            <ThemedInput
                                label="Card Title"
                                name={`serviceName-${index}`}
                                value={strength.serviceName}
                                onChange={(e: any) => handleStrengthChange(index, 'serviceName', e.target.value)}
                            />
                            <ThemedInput
                                label="Card Summary"
                                name={`summary-${index}`}
                                value={strength.summary}
                                onChange={(e: any) => handleStrengthChange(index, 'summary', e.target.value)}
                                isTextarea={true}
                            />
                            <ThemedInput
                                label="Icon Name (e.g., Globe, Clock)"
                                name={`icon-${index}`}
                                value={strength.icon}
                                onChange={(e: any) => handleStrengthChange(index, 'icon', e.target.value)}
                            />
                        </div>
                    );
                })}
            </div>
            
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isSaving}
                    className={`w-full flex items-center justify-center px-4 py-3 ${POP_BG} ${DARK_TEXT} font-semibold rounded-lg shadow-lg hover:bg-[#00D1E6] transition duration-200 disabled:opacity-50`}
                >
                    {isSaving ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                        <Save className="w-5 h-5 mr-2" />
                    )}
                    {isSaving ? "Saving..." : "Save Why Choose Us Section Text"}
                </button>
            </div>
        </form>
      </section>

      {/* --- Section 2: About Us Content & Metrics --- */}
      <section className={`p-6 my-8 ${CARD_BG} border border-gray-800 rounded-xl shadow-2xl`}>
        <h2 className="text-3xl font-bold mb-6 flex items-center border-b border-gray-700 pb-3">
          <Settings className={`w-6 h-6 mr-3 ${ACCENT_COLOR}`} /> Industrial Cargo Expertise (About Us)
        </h2>
        <form onSubmit={handleSaveText} className="space-y-6">
            <ThemedInput 
                name="aboutParagraph1"
                label="About Paragraph 1"
                value={formData.aboutParagraph1}
                onChange={handleTextChange}
                isTextarea={true}
            />
            <ThemedInput 
                name="aboutParagraph2"
                label="About Paragraph 2"
                value={formData.aboutParagraph2}
                onChange={handleTextChange}
                isTextarea={true}
            />

            <h3 className="text-xl font-semibold pt-4 border-t border-gray-700">Metrics (Years, Projects, Ports)</h3>
            <div className="grid grid-cols-3 gap-4">
                <ThemedInput 
                    name="yearsExperience"
                    label="Years Experience"
                    value={formData.yearsExperience}
                    onChange={handleTextChange}
                />
                <ThemedInput 
                    name="projectsDelivered"
                    label="Projects Delivered"
                    value={formData.projectsDelivered}
                    onChange={handleTextChange}
                />
                <ThemedInput 
                    name="globalPorts"
                    label="Global Ports"
                    value={formData.globalPorts}
                    onChange={handleTextChange}
                />
            </div>
            
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isSaving}
                    className={`w-full flex items-center justify-center px-4 py-3 ${POP_BG} ${DARK_TEXT} font-semibold rounded-lg shadow-lg hover:bg-[#00D1E6] transition duration-200 disabled:opacity-50`}
                >
                    {isSaving ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                        <Save className="w-5 h-5 mr-2" />
                    )}
                    {isSaving ? "Saving..." : "Save About Us & Metrics Text"}
                </button>
            </div>
        </form>
      </section>

      {/* --- Section 4: Links to External Content Management --- */}
      <section className={`p-6 my-8 ${CARD_BG} border border-gray-800 rounded-xl shadow-2xl`}>
        <h2 className="text-3xl font-bold mb-6 flex items-center border-b border-gray-700 pb-3">
          <LinkIcon className={`w-6 h-6 mr-3 ${ACCENT_COLOR}`} /> Manage Separate Collections
        </h2>
        <p className="mb-6 text-gray-400">
            The **Services**, **Gallery Images**, and **Global Location/Contact Details** are in separate collections. Use these links to manage them.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
                href="/admin/services"
                className={`flex flex-col items-center justify-center p-6 ${PRIMARY_BG} border border-[#00FFFF] ${ACCENT_COLOR} font-semibold rounded-lg shadow-md hover:bg-gray-800 transition duration-200 text-center`}
            >
                <Clock className="w-6 h-6 mb-2" />
                Manage Services
            </Link>
            <Link
                href="/admin/gallery"
                className={`flex flex-col items-center justify-center p-6 ${PRIMARY_BG} border border-[#00FFFF] ${ACCENT_COLOR} font-semibold rounded-lg shadow-md hover:bg-gray-800 transition duration-200 text-center`}
            >
                <ImageIcon className="w-6 h-6 mb-2" />
                Manage Operations Gallery
            </Link>
            <Link
                href="/admin/locations"
                className={`flex flex-col items-center justify-center p-6 ${PRIMARY_BG} border border-[#00FFFF] ${ACCENT_COLOR} font-semibold rounded-lg shadow-md hover:bg-gray-800 transition duration-200 text-center`}
            >
                <Globe className="w-6 h-6 mb-2" />
                Manage Contact & Global Coverage
            </Link>
        </div>
      </section>
    </main>
  );
}