import { CheckCircle, ToggleRight, User } from "lucide-react";

interface PendingMessagesTableProps {
  pendingMessages: any[];
  onToggleRead: (id: string, status: boolean) => void;
  onRowClick: (msg: any) => void; // NEW
}

const TEXT_POP_COLOR = "text-[#00D9FF]";
const BG_POP_COLOR = "bg-[#00D9FF]";

export default function PendingMessagesTable({
  pendingMessages,
  onToggleRead,
  onRowClick,
}: PendingMessagesTableProps) {
  if (pendingMessages.length === 0) {
    return (
      <div className="text-center p-10 text-gray-400 border border-dashed border-gray-600 rounded-lg mt-4">
        <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
        <p className="text-lg font-semibold">No Pending Follow-ups!</p>
        <p>All inquiries have been addressed for the moment.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-4 rounded-sm">
      <table className="min-w-full divide-y divide-gray-700 rounded-lg overflow-x-scroll">
        <thead className="bg-[#0A1C30] border-b border-gray-600">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Contact Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">
              Date Received
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Message Snippet
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-700">
          {pendingMessages.map((msg) => (
            <tr
              key={msg._id}
              className="bg-[#11001C] hover:bg-[#0A1C30] transition duration-150 cursor-pointer"
              onClick={() => onRowClick(msg)} // NEW → Opens modal
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white flex items-center">
                <User className={`w-4 h-4 mr-2 ${TEXT_POP_COLOR}`} />
                {msg.fullName || "N/A"}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {msg.email}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden sm:table-cell">
                {new Date(msg.createdAt).toLocaleDateString()}
              </td>

              <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                {msg.message.substring(0, 10)}...
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevents modal from opening
                    onToggleRead(msg._id, msg.isRead);
                  }}
                  className={`inline-flex items-center px-3 py-1 border border-transparent rounded-full shadow-sm text-xs font-medium text-[#11001C] ${BG_POP_COLOR} hover:opacity-90 transition`}
                >
                  <ToggleRight className="w-4 h-4 mr-1" /> Mark Responded
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
