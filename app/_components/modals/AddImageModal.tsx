'use client';

import { addGalleryImage } from '@/app/_actions/gallery';
import React, { useState, useTransition, useRef } from 'react';

// Define the component's props
interface AddImageModalProps {
  onClose: () => void;
}

export default function AddImageModal({ onClose }: AddImageModalProps) {
  // State for managing inputs and messages
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>(''); // <--- New Title State
  const [message, setMessage] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  
  // Ref to reset the file input field after submission
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    // Validation: Check for both File and Title
    if (!file) {
      setMessage('Please select an image file to upload.');
      return;
    }
    if (!title.trim()) {
      setMessage('Please enter a title for the image.');
      return;
    }

    // Create FormData object and append data
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title); // <--- Append Title to FormData
    
    // Start the server action
    startTransition(async () => {
      const result = await addGalleryImage(formData);

      if ('error' in result) {
        setMessage(`Upload Failed: ${result.error}`);
      } else {
        setMessage('Image uploaded and added to gallery successfully!');
        
        // Reset states
        setFile(null);
        setTitle(''); // <--- Clear Title
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        
        setTimeout(onClose, 2000); 
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black opacity-50 z-40"
      ></div>

      {/* Modal Content */}
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-[#11001C] p-6 rounded-lg shadow-2xl w-96 border border-gray-700">
          <h3 className="text-xl font-bold text-[#00D9FF] mb-4">
            Add New Gallery Image
          </h3>

          <form onSubmit={handleSubmit}>
            
            {/* New Title Input */}
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
                className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-[#00D9FF] transition"
              />
            </div>

            {/* File Input */}
            <div className="mb-4">
              <label htmlFor="imageFile" className="block text-gray-300 mb-2 font-medium">
                Select Image:
              </label>
              <input
                ref={fileInputRef}
                type="file"
                id="imageFile"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isPending}
                className="w-full text-gray-300 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600 transition"
              />
            </div>

            {/* Status Message */}
            {message && (
              <p className={`mb-4 text-sm font-semibold ${message.startsWith('Upload Failed') || message.startsWith('Please') ? 'text-red-400' : 'text-[#00D9FF]'}`}>
                {message}
              </p>
            )}

            {/* Submission Button */}
            <button
              type="submit"
              disabled={isPending || !file || !title.trim()} 
              className={`w-full bg-[#00D9FF] text-[#11001C] py-2 rounded font-semibold transition ${
                isPending || !file || !title.trim()
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:opacity-90'
              }`}
            >
              {isPending ? 'Uploading...' : 'Upload & Add Image'}
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