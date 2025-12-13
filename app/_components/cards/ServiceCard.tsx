// app/_components/ServiceCard.tsx
import { Pencil, Trash2 } from "lucide-react";

export default function ServiceCard({
  service,
  onEdit,
  onDelete,
}: {
  service: any;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-[#11001C] border border-gray-700 rounded-xl p-5 shadow-md hover:shadow-lg transition">
      <div className="flex items-center mb-3">
        <h3 className="text-xl font-semibold text-white">{service.serviceName}</h3>
      </div>

      <p className="text-gray-300 text-sm mb-2">{service.summary}</p>

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onEdit}
          className="px-3 py-1 text-xs bg-blue-500/30 text-blue-300 rounded-lg flex items-center hover:bg-blue-500/40 transition"
        >
          <Pencil className="w-4 h-4 mr-1" /> Edit
        </button>

        <button
          onClick={onDelete}
          className="px-3 py-1 text-xs bg-red-500/30 text-red-300 rounded-lg flex items-center hover:bg-red-500/40 transition"
        >
          <Trash2 className="w-4 h-4 mr-1" /> Delete
        </button>
      </div>
    </div>
  );
}
