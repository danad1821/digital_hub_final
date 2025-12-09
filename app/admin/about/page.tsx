// components/AdminAbout.tsx (Client Component - Refactored)

'use client'; 

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Loader2, ArrowRight, Trash2, Upload, X } from "lucide-react";
import Image from "next/image"; 

// Import the new server actions
import { deletePageImageByFileId, updatePageSectionImage } from '@/app/_actions/pages';

// Assuming the correct path to your types and HomeInfoCard
import { 
    PageDocument, 
    CoreValue, 
    ApiResponse, 
    PageSection 
} from '@/app/_types/PageData';
import HomeInfoCard from "@/app/_components/HomeInfoCard"; 

// --- Utility Functions (Keep these the same) ---
const findSectionIndex = (data: PageDocument, type: string) => data.sections.findIndex(s => s.type === type);

// Utility for creating the gradient title class (replicated from client)
const gradientTitleClasses = `
    gradient-text
    font-black
    tracking-tight
    bg-gradient-to-r
    from-[#00FFFF]
    to-[#0A1C30] pb-2
`;

// Define the Service/Value interface for HomeInfoCard
interface Service { serviceName: string; summary: string; icon: any; }

// ====================================================================
// --- CoreValuesEditor Component (Handles the Array) --- (Unmodified)
// ====================================================================
const CoreValuesEditor = ({ sectionIndex, pageData, setPageData }: any) => {
    const coreValuesSection = pageData.sections[sectionIndex] as PageSection<{ 
        title: string;
        intro_text: string;
        values: CoreValue[] 
    }>;
    const coreValuesData = coreValuesSection.data;

    // A utility function to update an item within the 'values' array
    const handleValueItemChange = (valueKey: string, key: keyof CoreValue, value: string) => {
        setPageData((prevData: any) => {
            if (!prevData) return null;
            const newSections = [...prevData.sections];
            
            const newValues = coreValuesData.values.map(val => 
                val.key === valueKey ? { ...val, [key]: value } : val
            );

            newSections[sectionIndex] = { 
                ...coreValuesSection, 
                data: { ...coreValuesData, values: newValues } 
            };
            
            return { ...prevData, sections: newSections };
        });
    };

    // A utility function to add a new Core Value item
    const addCoreValue = () => {
        setPageData((prevData: any) => {
            if (!prevData) return null;
            const newSections = [...prevData.sections];
            const newValue: CoreValue = { key: uuidv4(), icon: "ArrowRight", name: "New Value", description: "Description here." };
            
            newSections[sectionIndex] = {
                ...coreValuesSection,
                data: { ...coreValuesData, values: [...coreValuesData.values, newValue] }
            };
            
            return { ...prevData, sections: newSections };
        });
    };
    
    // A utility function to remove a Core Value item
    const removeCoreValue = (valueKey: string) => {
        setPageData((prevData: any) => {
            if (!prevData) return null;
            const newSections = [...prevData.sections];
            
            const updatedValues = coreValuesData.values.filter(val => val.key !== valueKey);

            newSections[sectionIndex] = {
                ...coreValuesSection,
                data: { ...coreValuesData, values: updatedValues }
            };
            
            return { ...prevData, sections: newSections };
        });
    };

    return (
        <div className='p-4 border border-blue-200 bg-blue-50/50 rounded-lg'>
            <h4 className='text-lg font-semibold mb-3'>Array Editor</h4>
            <button type="button" onClick={addCoreValue} className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors mb-4'>
                + Add New Core Value
            </button>
            
            {coreValuesData.values.map((val: CoreValue) => (
                <div key={val.key} className='border border-gray-300 p-4 mb-4 rounded-sm bg-white shadow-sm'>
                    <div className='flex justify-between items-center mb-2'>
                        <h5 className='text-base font-bold text-gray-800'>{val.name || 'Untitled Value'}</h5>
                        <button type="button" onClick={() => removeCoreValue(val.key)} className='text-red-600 text-sm hover:text-red-800 transition-colors'>
                            Remove
                        </button>
                    </div>
                    <label className='block text-xs font-medium text-gray-500 mt-2'>Name:</label>
                    <input type="text" value={val.name} onChange={(e) => handleValueItemChange(val.key, 'name', e.target.value)} className='w-full p-2 border rounded-sm text-sm' />
                    
                    <label className='block text-xs font-medium text-gray-500 mt-2'>Description:</label>
                    <textarea value={val.description} onChange={(e) => handleValueItemChange(val.key, 'description', e.target.value)} className='w-full p-2 border rounded-sm text-sm min-h-[50px]' />
                    
                    <label className='block text-xs font-medium text-gray-500 mt-2'>Icon Class/Ref:</label>
                    <input type="text" value={val.icon} onChange={(e) => handleValueItemChange(val.key, 'icon', e.target.value)} className='w-full p-2 border rounded-sm text-sm' />
                </div>
            ))}
        </div>
    );
};


// ====================================================================
// --- NEW ImageEditor Component ---
// ====================================================================

interface ImageEditorProps {
    sectionIndex: number;
    imageKey: string; // e.g., 'image_ref'
    pageData: PageDocument;
    setPageData: React.Dispatch<React.SetStateAction<PageDocument | null>>;
    isLarge?: boolean; // For visual styling
}

const ImageEditor: React.FC<ImageEditorProps> = ({ 
    sectionIndex, 
    imageKey, 
    pageData, 
    setPageData,
    isLarge = false
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const currentFileId = pageData.sections[sectionIndex].data[imageKey] || null;
    
    // Clear temporary object URL when component unmounts or file changes
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Create a client-side preview URL for immediate display
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(null);
        }
    };
    
    const handleUpload = async (pageSlug: string, sectionType: string) => {
    if (!fileInputRef.current?.files?.[0]) {
        alert("Please select a file first.");
        return;
    }

    const file = fileInputRef.current.files[0];
    
    // We removed the manual 'deletePageImageByFileId' call because 
    // updatePageSectionImage handles old file cleanup on the server.
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file); // 'image' must match the key expected by uploadImage

    try {
        // 🌟 KEY FIX: Call the single, atomic Server Action
        // This function uploads the file, updates the 'image_ref' in MongoDB, 
        // AND deletes the old GridFS file.
        const result = await updatePageSectionImage(pageSlug, sectionType, formData);

        if (result.success && result.newFileId) {
            
            // 2. Update the pageData state (client-side UI update only)
            setPageData((prevData: any) => {
                if (!prevData) return null;
                
                // Find the index dynamically using sectionType
                const sectionIndex = prevData.sections.findIndex((s: any) => s.type === sectionType);

                if (sectionIndex === -1) return prevData;
                
                const newSections = [...prevData.sections];
                
                // Assuming imageKey is 'image_ref'
                const imageKey = 'image_ref'; 
                
                newSections[sectionIndex] = {
                    ...newSections[sectionIndex],
                    // Use the new ID returned from the server to update the local state
                    data: { ...newSections[sectionIndex].data, [imageKey]: result.newFileId }
                };
                return { ...prevData, sections: newSections };
            });

            alert('Image successfully updated and saved to database!');

            // Clear input and preview after successful upload
            if (fileInputRef.current) fileInputRef.current.value = "";
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
            
        } else {
            // Check for explicit error message from server action
            throw new Error(result.error || "Database update failed or returned no file ID.");
        }
    } catch (error) {
        alert(`Upload error: ${(error as Error).message}`);
    } finally {
        setIsUploading(false);
    }
};

    const handleDelete = async () => {
        if (!currentFileId || currentFileId.startsWith('/images/')) {
            // Cannot delete if no ID or if it's a static path placeholder
            return;
        }

        if (!window.confirm("Are you sure you want to remove this image?")) {
            return;
        }

        setIsUploading(true); // Reusing upload state for deletion status

        try {
            const result = await deletePageImageByFileId(currentFileId);

            if (result.success) {
                // Remove the image reference from pageData state
                setPageData((prevData: any) => {
                    if (!prevData) return null;
                    const newSections = [...prevData.sections];
                    newSections[sectionIndex] = {
                        ...newSections[sectionIndex],
                        data: { ...newSections[sectionIndex].data, [imageKey]: '' }
                    };
                    return { ...prevData, sections: newSections };
                });
            } else {
                throw new Error(result.error || "Deletion failed on the server.");
            }
        } catch (error) {
            alert(`Deletion error: ${(error as Error).message}`);
        } finally {
            setIsUploading(false);
        }
    };

    // Determine the source for the visual preview
    const imgSrc = useMemo(() => {
        if (previewUrl) {
            return previewUrl;
        }
        if (currentFileId && !currentFileId.startsWith('/images/')) {
            // Dynamic GridFS URL
            return `/api/files/${currentFileId}`;
        }
        // Static URL placeholder (e.g., '/images/image4.jpeg')
        return currentFileId; 
    }, [currentFileId, previewUrl]);

    // Check if the current reference is a valid uploaded image (i.e., a GridFS ID)
    const hasUploadedImage = currentFileId && !currentFileId.startsWith('/images/');


    return (
        <div className={`absolute inset-0 ${isLarge ? 'p-0' : 'p-4'} z-10 flex flex-col justify-end items-center bg-black/50`}>
            {/* Visual Preview */}
            {imgSrc && (
                <Image
                    src={imgSrc}
                    alt="Current or uploaded image preview"
                    fill
                    sizes="100vw"
                    className={`object-cover ${isLarge ? 'blur-sm opacity-50' : 'opacity-20'}`}
                />
            )}
            
            <div className={`p-4 rounded-lg bg-black/80 text-white shadow-xl flex gap-3 items-center z-20 ${isLarge ? 'mb-4' : ''}`}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id={`file-upload-${sectionIndex}-${imageKey}`}
                    disabled={isUploading}
                />
                
                <label 
                    htmlFor={`file-upload-${sectionIndex}-${imageKey}`} 
                    className={`flex items-center justify-center p-2 rounded-md transition-colors cursor-pointer 
                        ${isUploading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    <Upload className="w-5 h-5 mr-2" />
                    {hasUploadedImage ? 'Change Image' : 'Select Image'}
                </label>

                {previewUrl && (
                    <button
                        type="button"
                        onClick={()=>handleUpload('about-us', pageData.sections[sectionIndex].type)}
                        disabled={isUploading}
                        className={`flex items-center justify-center p-2 rounded-md transition-colors text-white ${isUploading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {isUploading ? <Loader2 className="animate-spin w-5 h-5" /> : <Upload className="w-5 h-5" />}
                        {isUploading ? 'Uploading...' : 'Confirm Upload'}
                    </button>
                )}

                {hasUploadedImage && !previewUrl && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isUploading}
                        className={`flex items-center justify-center p-2 rounded-md transition-colors text-white ${isUploading ? 'bg-gray-500' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                        {isUploading ? <Loader2 className="animate-spin w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
                        Remove
                    </button>
                )}
                
                {previewUrl && (
                    <button
                        type="button"
                        onClick={() => {
                            if (fileInputRef.current) fileInputRef.current.value = "";
                            if (previewUrl) URL.revokeObjectURL(previewUrl);
                            setPreviewUrl(null);
                        }}
                        className='p-2 rounded-md bg-yellow-500 hover:bg-yellow-600'
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
                
                {/* Display current ID for reference */}
                <span className='text-xs text-gray-400 max-w-[150px] truncate ml-3'>
                    ID: {hasUploadedImage ? currentFileId : 'Static/None'}
                </span>

            </div>
        </div>
    );
};

// ====================================================================
// --- MAIN ADMIN COMPONENT --- (Integration of ImageEditor)
// ====================================================================

export default function AdminAbout() {
    const [pageData, setPageData] = useState<PageDocument | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // --- State Update Utilities (Unmodified) ---
    const handlePageChange = (key: keyof PageDocument, value: string) => {
        setPageData((prevData: any) => prevData ? ({ ...prevData, [key]: value }) : null);
    };
    
    const handleSectionDataChange = (sectionIndex: number, key: string, value: string) => {
        setPageData((prevData: any) => {
            if (!prevData) return null;
            const newSections = [...prevData.sections];
            newSections[sectionIndex] = {
                ...newSections[sectionIndex],
                data: { ...newSections[sectionIndex].data, [key]: value }
            };
            return { ...prevData, sections: newSections };
        });
    };

    const handleNestedSectionChange = (sectionIndex: number, primaryKey: string, subKey: string, value: string) => {
        setPageData((prevData: any) => {
            if (!prevData) return null;
            const newSections = [...prevData.sections];
            const section = newSections[sectionIndex];

            newSections[sectionIndex] = {
                ...section,
                data: {
                    ...section.data,
                    [primaryKey]: { ...section.data[primaryKey], [subKey]: value }
                }
            };
            return { ...prevData, sections: newSections };
        });
    };
    
    // --- Data Fetching and Saving (Unmodified) ---
    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const response = await fetch('/api/pages/about-us');
                const result: ApiResponse<PageDocument> = await response.json();
                
                if (!response.ok || !result.success || !result.data) {
                    throw new Error(result.error || 'Failed to fetch page data');
                }
                
                const dataWithKeys = ensureKeys(result.data);
                setPageData(dataWithKeys);

            } catch (err: any) {
                setMessage(`Error loading content: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchPageData();
    }, []);
    
    const ensureKeys = (data: PageDocument): PageDocument => {
        const cvIndex = findSectionIndex(data, 'core_values');
        if (cvIndex !== -1) {
            const values = data.sections[cvIndex].data.values;
            const updatedValues = values.map((v: CoreValue) => ({ ...v, key: v.key || uuidv4() }));
            data.sections[cvIndex].data.values = updatedValues;
        }
        return data;
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pageData) return;

        setIsSaving(true);
        setMessage('Saving changes...');

        try {
            const response = await fetch(`/api/pages/${pageData.slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pageData),
            });

            const result: ApiResponse<PageDocument> = await response.json();

            if (!response.ok || !result.success || !result.data) {
                throw new Error(result.error || 'Save failed on the server.');
            }

            setMessage('✅ Page saved successfully!');
            setPageData(ensureKeys(result.data)); 

        } catch (error: any) {
            setMessage(`❌ Error saving: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };
    
    // --- Render Logic Setup ---
    if (loading) return <main className='p-8'><Loader2 className="animate-spin w-8 h-8 mr-2 inline-block" /> Loading editable content...</main>;
    if (!pageData) return <main className='p-8'><p>No page data found.</p></main>;

    const heroIndex = findSectionIndex(pageData, 'hero');
    const vmIndex = findSectionIndex(pageData, 'vision_mission');
    const cvIndex = findSectionIndex(pageData, 'core_values');
    
    // Default values if section is missing (to prevent crashes)
    const heroData = heroIndex !== -1 ? pageData.sections[heroIndex].data : {};
    const vmData = vmIndex !== -1 ? pageData.sections[vmIndex].data : { vision: {}, mission: {} };
    const cvData = cvIndex !== -1 ? pageData.sections[cvIndex].data : { title: '', intro_text: '', values: [] };

    // Determine preview image sources
    const heroImageSrc = heroData.image_ref && !heroData.image_ref.startsWith('/images/') 
        ? `/api/files/${heroData.image_ref}` 
        : '/images/image4.jpeg'; // Fallback static image path

    const vmImageSrc = vmData.image_ref && !vmData.image_ref.startsWith('/images/') 
        ? `/api/files/${vmData.image_ref}` 
        : '/images/image6.jpeg'; // Fallback static image path
    
    // Placeholder component to simulate the Header for visual context
    const HeaderPlaceholder = () => (
        <div className="bg-[#0A1C30] text-white py-4 shadow-lg">
            <div className="custom-container flex justify-between items-center">
                <span className="text-xl font-bold">ALTA MARITIME (Admin View)</span>
                <nav className="text-sm">Services | About | ...</nav>
            </div>
        </div>
    );
    

    return (
        <form onSubmit={handleSave} className="min-h-screen font-sans">
            <HeaderPlaceholder />
            
            <div className="p-4 border-b border-gray-200 bg-white shadow-md sticky top-0 z-50">
                <div className="custom-container flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Editing: {pageData.page_title}</h2>
                    <button 
                        type="submit" 
                        disabled={isSaving} 
                        className={`px-6 py-2 rounded-md transition-colors ${isSaving ? 'bg-gray-400' : 'bg-[#007bff] hover:bg-[#0066cc] text-white'}`}
                    >
                        {isSaving ? (
                            <><Loader2 className="animate-spin w-4 h-4 mr-2 inline-block" /> Saving...</>
                        ) : 'Save All Changes'}
                    </button>
                </div>
                <p className={`mt-2 text-sm text-center ${message.startsWith('✅') ? 'text-green-600' : message.startsWith('❌') ? 'text-red-600' : 'text-orange-500'}`}>{message}</p>
            </div>
            
            <main>

                {/* --- 1. HERO SECTION (Editable with ImageEditor) --- */}
                <div className="relative h-[50vh] overflow-hidden flex items-center justify-center border-4 border-dashed border-gray-500/50">
                    {/* Background Image Placeholder/Editor */}
                    {heroIndex !== -1 && (
                        <ImageEditor 
                            sectionIndex={heroIndex}
                            imageKey={'image_ref'}
                            pageData={pageData}
                            setPageData={setPageData}
                            isLarge={true}
                        />
                    )}
                    {/* Visual Placeholder (if no image is set) */}
                    {!heroData.image_ref && <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">No Hero Image Set</div>}
                    
                    {/* Content Layer (unchanged text editing) */}
                    <div className="absolute inset-0 flex flex-col justify-center custom-container z-10 text-white pt-16 md:pt-20 pointer-events-none">
                        <p className="bg-gray-300/50 border border-gray-300 w-fit px-2 py-1 rounded-sm text-sm pointer-events-auto">
                            OUR COMPANY STORY
                        </p>
                        
                        <h1 className="text-5xl sm:text-6xl font-bold mb-4 tracking-tight flex flex-col mt-2">
                            <span>Leading Maritime </span> 
                            <span className={gradientTitleClasses}>
                                <textarea 
                                    value={heroData.headline || 'Solutions Provider'} 
                                    onChange={(e) => handleSectionDataChange(heroIndex, 'headline', e.target.value)} 
                                    className='w-full bg-transparent text-white border-b-2 border-white/50 resize-none overflow-hidden h-20 pointer-events-auto'
                                />
                            </span>
                        </h1>
                    </div>
                </div>
                
                {/* --- 2. VISION & MISSION SECTION (Editable with ImageEditor) --- */}
                <section className="flex items-center custom-container justify-between py-20 gap-x-10 flex-wrap lg:flex-nowrap border-b border-gray-200">
                    
                    {/* Image Placeholder/Editor */}
                    <div className="relative lg:w-1/2 min-h-[300px] mt-12 lg:mt-0 p-4 border-2 border-dashed border-blue-400/50">
                         {vmIndex !== -1 && (
                            <ImageEditor 
                                sectionIndex={vmIndex}
                                imageKey={'image_ref'}
                                pageData={pageData}
                                setPageData={setPageData}
                                isLarge={false}
                            />
                        )}
                        {/* Fallback image (or the dynamically loaded one) */}
                        {vmImageSrc && (
                            <Image
                                src={vmImageSrc}
                                alt="Team at work in a modern office"
                                width={500}
                                height={500}
                                className="z-[20] w-full h-auto rounded-sm object-cover"
                            />
                        )}
                        <div className="z-[-1] rounded-sm bg-[#00FFFF]/15 w-full absolute inset-0 rotate-3"></div>
                    </div>
                    
                    <div className="lg:w-1/2 mt-8 lg:mt-0">
                        <h2 className="text-4xl sm:text-5xl font-extrabold flex flex-col my-2 text-[#0A1C30]">
                            <span>Our Vision &</span>
                            <span className={gradientTitleClasses}>Mission</span>
                        </h2>
                        
                        <div className="mt-8 space-y-8">
                            {/* Vision Block (Editable) */}
                            <div className="p-6 border-l-4 border-[#00FFFF] bg-gray-50 rounded-sm hover:shadow-lg transition-shadow">
                                <h3 className="text-2xl font-bold text-[#0A1C30] mb-2">
                                    <input 
                                        type="text" 
                                        value={vmData.vision?.title || 'Our Vision'} 
                                        onChange={(e) => handleNestedSectionChange(vmIndex, 'vision', 'title', e.target.value)} 
                                        className='w-full bg-transparent border-b border-gray-300'
                                    />
                                </h3>
                                <textarea 
                                    value={vmData.vision?.text || 'To be the global leader...'}
                                    onChange={(e) => handleNestedSectionChange(vmIndex, 'vision', 'text', e.target.value)}
                                    className='w-full text-gray-700 bg-white p-2 border rounded-sm min-h-[100px]'
                                />
                            </div>
                            
                            {/* Mission Block (Editable) */}
                            <div className="p-6 border-l-4 border-[#00FFFF] bg-gray-50 rounded-sm hover:shadow-lg transition-shadow">
                                <h3 className="text-2xl font-bold text-[#0A1C30] mb-2">
                                    <input 
                                        type="text" 
                                        value={vmData.mission?.title || 'Our Mission'} 
                                        onChange={(e) => handleNestedSectionChange(vmIndex, 'mission', 'title', e.target.value)} 
                                        className='w-full bg-transparent border-b border-gray-300'
                                    />
                                </h3>
                                <textarea 
                                    value={vmData.mission?.text || 'We commit to delivering tailored...'}
                                    onChange={(e) => handleNestedSectionChange(vmIndex, 'mission', 'text', e.target.value)}
                                    className='w-full text-gray-700 bg-white p-2 border rounded-sm min-h-[100px]'
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 3. OUR CORE VALUES SECTION (Combined Editing/Viewing) --- */}
                <section className="py-20 bg-gray-50 border-b border-gray-200">
                    <div className="custom-container">
                        
                        {/* Title (Editable) */}
                        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4 text-[#0A1C30]">
                            <input 
                                type="text" 
                                value={cvData.title || 'Our Core Values'} 
                                onChange={(e) => handleSectionDataChange(cvIndex, 'title', e.target.value)} 
                                className='w-full text-center bg-transparent border-b border-gray-300 p-1'
                            />
                        </h2>
                        
                        {/* Intro Text (Editable) */}
                        <textarea 
                            value={cvData.intro_text || 'The principles that guide our decisions...'}
                            onChange={(e) => handleSectionDataChange(cvIndex, 'intro_text', e.target.value)}
                            className='w-full text-center mb-12 text-gray-400 max-w-2xl mx-auto block bg-white p-2 border rounded-sm min-h-[50px]'
                        />

                        {/* Visual Display of Current Values */}
                        <h3 className='text-center text-xl font-semibold mb-4'>Live Preview:</h3>
                        <div className="flex flex-wrap gap-5 items-stretch justify-evenly border-b-2 border-gray-300 pb-8 mb-8">
                            {/* Map over the live data for the visual preview */}
                            {cvData.values.map((v: CoreValue) => (
                                <HomeInfoCard 
                                    key={v.key} 
                                    service={{ serviceName: v.name, summary: v.description, icon: <ArrowRight /> }} 
                                    icon={<ArrowRight />} 
                                />
                            ))}
                        </div>
                        
                        {/* Array Editor Component */}
                        <h3 className='text-center text-xl font-semibold mb-4'>Value Array Management:</h3>
                        {cvIndex !== -1 && (
                            <div className="max-w-4xl mx-auto">
                                <CoreValuesEditor 
                                    sectionIndex={cvIndex} 
                                    pageData={pageData} 
                                    setPageData={setPageData}
                                />
                            </div>
                        )}
                        
                    </div>
                </section>
                
                {/* Save button at the bottom for convenience */}
                <div className="custom-container py-10">
                    <button 
                        type="submit" 
                        disabled={isSaving} 
                        className={`w-full py-3 text-xl rounded-md transition-colors ${isSaving ? 'bg-gray-400' : 'bg-[#007bff] hover:bg-[#0066cc] text-white'}`}
                    >
                        {isSaving ? (
                            <><Loader2 className="animate-spin w-5 h-5 mr-2 inline-block" /> Saving...</>
                        ) : 'Save All Changes'}
                    </button>
                </div>
            </main>
        </form>
    );
}