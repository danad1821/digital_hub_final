// app/_components/AllMessagesTable.tsx
import { User, Trash } from "lucide-react";

interface AllMessagesTableProps {
  messages: any[];
  onRowClick: (msg: any) => void;
  onDeleteMessage: (id: string) => void;    // ⬅ NEW PROP
}

const TEXT_POP_COLOR = "text-[#00FFFF]";

export default function AllMessagesTable({
  messages,
  onRowClick,
  onDeleteMessage,
}: AllMessagesTableProps) {
  if (!messages || messages.length === 0) {
    return (
      <div className="text-center p-10 text-gray-400 border border-dashed border-gray-600 rounded-lg mt-4">
        <p className="text-lg font-semibold">No Messages Found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-4 rounded-sm">
      <table className="min-w-full divide-y divide-gray-700 rounded-lg">
        <thead className="bg-[#0A1C30] border-b border-gray-600">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Message
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-700">
          {messages.map((msg) => (
            <tr
              key={msg._id}
              className="bg-[#11001C] hover:bg-[#0A1C30] transition duration-150 cursor-pointer"
              onClick={() => onRowClick(msg)}
            >
              <td className="px-6 py-4 text-sm text-white flex items-center">
                <User className={`w-4 h-4 mr-2 ${TEXT_POP_COLOR}`} />
                {msg.fullName || "N/A"}
              </td>

              <td className="px-6 py-4 text-sm text-gray-300">{msg.email}</td>

              <td className="px-6 py-4 text-sm text-gray-400 hidden sm:table-cell">
                {new Date(msg.createdAt).toLocaleDateString()}
              </td>

              <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                {msg.message.substring(0, 20)}...
              </td>

              {/* DELETE BUTTON */}
              <td className="px-6 py-4 text-center">
                <button
                  className="text-red-400 hover:text-red-600 transition"
                  onClick={(e) => {
                    e.stopPropagation(); // ⬅ Prevent modal from opening
                    onDeleteMessage(msg._id);
                  }}
                >
                  <Trash className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
