// app/admin/schedule/AdminSchedule.tsx
"use client";

import { useState, useRef, useEffect, useTransition } from 'react';
import { 
  uploadSchedule, // <-- NEW NAME
  deleteSchedule, // <-- NEW NAME
  getCurrentSchedule, 
  ScheduleMetadata // <-- NEW TYPE ALIAS
} from '@/app/_actions/uploadFile'; // Path remains the same for action grouping

// Define a simple storage for the current file ID (the GridFS ID)
let currentFileId: string | null = null; 

export default function AdminSchedule() {
  const [file, setFile] = useState<File | null>(null);
  // Updated metadata type
  const [metadata, setMetadata] = useState<ScheduleMetadata | null>(null); 
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Initial Load: Fetch the currently uploaded file metadata
  useEffect(() => {
    startTransition(async () => {
      const current = await getCurrentSchedule();
      if (current) {
        setMetadata(current);
        // CRITICAL: currentFileId stores the GridFS ID from the Schedule model's fileId field
        currentFileId = current.id; 
      }
    });
  }, []);

  // 2. Handle File Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
        // Simple PDF validation
        if (selectedFile.type !== 'application/pdf') {
            setError('Only PDF files are allowed.');
            setFile(null);
            return;
        }
        if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit (Adjust as needed)
            setError('File size must be under 10MB.');
            setFile(null);
            return;
        }
        setError('');
        setMessage('');
        setFile(selectedFile);
    }
  };

  // 3. Handle Upload (Update)
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file to upload.');
      return;
    }

    setMessage('Uploading schedule...');
    setError('');

    // Prepare FormData
    const formData = new FormData();
    formData.append('image', file); // 'image' key must match the action function

    startTransition(async () => {
      // Pass the existing file ID (GridFS ID) for deletion and replacement
      // uploadSchedule will handle deleting both the old file and the model entry
      const result = await uploadSchedule(formData, currentFileId); 

      if (result.success && result.fileId) {
        // Refetch the metadata to update the UI with the new file info
        const newMetadata = await getCurrentSchedule(); 
        if (newMetadata) {
            setMetadata(newMetadata);
            currentFileId = newMetadata.id; // Update global ID for future deletion
            setMessage('Schedule uploaded and replaced successfully!');
        } else {
            setMessage('Upload successful, but failed to fetch new metadata.');
        }

        // Reset file input state for security/cleanliness
        setFile(null); 
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setError(result.error || 'Upload failed due to an unknown error.');
        setMessage('');
      }
    });
  };

  // 4. Handle Delete
  const handleDelete = () => {
    if (!currentFileId) {
      setError('No current schedule to delete.');
      return;
    }

    setMessage('Deleting schedule...');
    setError('');

    startTransition(async () => {
      // Use the updated deleteSchedule action
      const result = await deleteSchedule(currentFileId!); 

      if (result.success) {
        setMetadata(null);
        currentFileId = null; // Clear ID
        setMessage('Schedule successfully deleted.');
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setError(result.error || 'Deletion failed.');
        setMessage('');
      }
    });
  };

  // Memoize the PDF URL for rendering
  const pdfUrl = metadata ? `/api/schedule/${metadata.id}` : null;


  return (
    <div className="text-grey-800 p-8 space-y-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold border-b pb-4 border-gray-700">Manage Shipping Schedule</h1>
      
      {/* Upload Section */}
      <section className="bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Upload New Schedule (PDF)</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />

          <div className='flex gap-4'>
            {/* Upload Button */}
            <button
              type="submit"
              className={`px-6 py-2 rounded-md font-semibold text-white transition duration-300 ${
                file && !isPending ? 'bg-[#00D9FF] text-[#0A1628] hover:brightness-75' : 'bg-gray-600 cursor-not-allowed'
              }`}
              disabled={isPending || !file}
            >
              {isPending ? 'Uploading...' : metadata ? 'Upload & Replace Schedule' : 'Upload Schedule'}
            </button>

            {/* Delete Button (Only visible if a schedule exists) */}
            {metadata && (
                <button
                    type="button"
                    onClick={handleDelete}
                    className={`px-6 py-2 rounded-md font-semibold text-white transition duration-300 ${
                        isPending ? 'bg-red-900 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                    }`}
                    disabled={isPending}
                >
                    {isPending ? 'Deleting...' : 'Delete Current Schedule'}
                </button>
            )}
          </div>
        </form>

        {/* Status Messages */}
        {message && <p className="mt-4 text-green-400">{message}</p>}
        {error && <p className="mt-4 text-red-400 font-bold">Error: {error}</p>}
      </section>

      {/* Display Section */}
      <section className="bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-4">
            Current Schedule Display 
            {metadata && <span className="text-sm font-normal ml-2 text-gray-400">({metadata.filename})</span>}
        </h2>
        
        {pdfUrl ? (
          <>
            <p className="mb-4 text-sm text-gray-400">
                Uploaded: {new Date(metadata!.uploadDate).toLocaleString()} 
            </p>
            <div className="w-full h-[800px] border-2 border-gray-700 rounded-lg overflow-hidden">
                {/* Use an iframe to embed the PDF from the API route */}
                <iframe 
                    src={pdfUrl} 
                    title="Current PDF Schedule"
                    className="w-full h-full"
                    style={{ border: 'none' }}
                />
            </div>
            <p className="mt-4 text-sm text-gray-500">
                URL to share: <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-[#00D9FF] break-all hover:underline">{pdfUrl}</a>
            </p>
          </>
        ) : (
          <p className="text-gray-400">No schedule file currently uploaded.</p>
        )}
      </section>
    </div>
  );
}