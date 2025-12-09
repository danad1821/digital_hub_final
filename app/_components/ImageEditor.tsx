import { PageDocument } from "../_types/PageData";
import { useRef, useState, useEffect, useMemo } from "react";
import { updatePageSectionImage, deletePageImageByFileId } from "../_actions/pages";
import { X, Loader2, Upload, Trash2 } from "lucide-react";
import Image from "next/image";

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

export default ImageEditor;