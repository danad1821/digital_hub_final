// app/_components/AddServiceModal.tsx
import { useState } from "react";

export default function AddServiceModal({
  initialService,
  onSave,
  onClose,
}: {
  initialService?: any;
  onSave: (service: any) => void;
  onClose: () => void;
}) {
  const [serviceName, setServiceName] = useState(
    initialService?.serviceName || ""
  );
  const [summary, setSummary] = useState(initialService?.summary || "");
  const [description, setDescription] = useState(
    initialService?.description || ""
  );

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black opacity-50 z-40"
      ></div>

      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-[#11001C] p-6 rounded-lg shadow-lg w-96 border border-gray-700">
          <h3 className="text-xl font-bold text-[#00FFFF] mb-4">
            {initialService ? "Edit Service" : "Add Service"}
          </h3>

          <div className="space-y-3">
            <input
              placeholder="Service Name"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full p-2 rounded bg-gray-900 text-gray-200 border border-gray-700"
            />

            <input
              placeholder="Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-2 rounded bg-gray-900 text-gray-200 border border-gray-700"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded bg-gray-900 text-gray-200 border border-gray-700 h-28"
            />
          </div>

          <button
            onClick={() =>
              onSave(
                initialService
                  ? {
                      _id: initialService._id,
                      serviceName,
                      summary,
                      description,
                    }
                  : {
                      serviceName,
                      summary,
                      description,
                    }
              )
            }
            className="w-full mt-4 bg-[#00FFFF] text-[#11001C] py-2 rounded font-semibold hover:opacity-90 transition"
          >
            Save
          </button>

          <button
            onClick={onClose}
            className="w-full mt-2 bg-gray-700 text-white py-2 rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
