// fileName: EditImageModal.tsx
'use client';

import { editGalleryImage } from '@/app/_actions/gallery';
import { GalleryImageDocument } from '@/app/_models/GalleryImage';
import React, { useState, useTransition } from 'react';

// Define the component's props
interface EditImageModalProps {
  imageDoc: GalleryImageDocument;
  onClose: () => void;
  onEditComplete: () => void; // Callback after successful edit
}

export default function EditImageModal({ imageDoc, onClose, onEditComplete }: EditImageModalProps) {
  
  // State for managing title input and messages, initialized with current title
  const [title, setTitle] = useState<string>(imageDoc.title as string);
  const [message, setMessage] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    // Validation
    if (!title.trim()) {
      setMessage('Please enter a title for the image.');
      return;
    }

    // Create FormData object and append data
    const formData = new FormData();
    formData.append('title', title);
    
    // Start the server action
    startTransition(async () => {
      // Pass the document ID and the FormData to the new server action
      const result = await editGalleryImage(imageDoc._id.toString(), formData);

      if (result.error) {
        setMessage(`Update Failed: ${result.error}`);
      } else {
        setMessage('Image title updated successfully!');
        
        // Call parent callback to refresh gallery list
        onEditComplete(); 
        
        setTimeout(onClose, 2000); 
      }
    });
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={isPending ? undefined : onClose} // Prevent closing while pending
        className="fixed inset-0 bg-black opacity-50 z-40"
      ></div>

      {/* Modal Content */}
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-[#11001C] p-6 rounded-lg shadow-2xl w-96 border border-gray-700">
          <h3 className="text-xl font-bold text-[#00FFFF] mb-4">
            Edit Gallery Image
          </h3>
          
          <img 
            src={`/api/images/${imageDoc.image.toString()}`} 
            alt={`Current image: ${imageDoc.title}`} 
            className="w-full h-32 object-cover rounded mb-4 border border-gray-600"
          />

          <form onSubmit={handleSubmit}>
            
            {/* Title Input */}
            <div className="mb-4">
              <label htmlFor="imageTitle" className="block text-gray-300 mb-2 font-medium">
                Image Title:
              </label>
              <input
                type="text"
                id="imageTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isPending}
                placeholder="Enter a title..."
                className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-[#00FFFF] transition"
              />
            </div>
            
            {/* Status Message */}
            {message && (
              <p className={`mb-4 text-sm font-semibold ${message.startsWith('Update Failed') || message.startsWith('Please') ? 'text-red-400' : 'text-[#00FFFF]'}`}>
                {message}
              </p>
            )}

            {/* Submission Button */}
            <button
              type="submit"
              disabled={isPending || !title.trim()} 
              className={`w-full bg-[#00FFFF] text-[#11001C] py-2 rounded font-semibold transition ${
                isPending || !title.trim()
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:opacity-90'
              }`}
            >
              {isPending ? 'Updating...' : 'Save Changes'}
            </button>
          </form>

          {/* Close Button */}
          <button
            onClick={onClose}
            disabled={isPending}
            className={`w-full mt-3 bg-gray-700 text-gray-300 py-2 rounded font-semibold transition ${
              isPending ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-600'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}