// app/_components/MessageModal.tsx
export default function MessageModal({
  message,
  onClose,
}: {
  message: any;
  onClose: () => void;
}) {
  if (!message) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black opacity-50 z-40"
      ></div>

      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-[#11001C] p-6 rounded-lg shadow-lg w-96 border border-gray-700">
          <h3 className="text-xl font-bold text-[#00FFFF] mb-4">
            Message Details
          </h3>

          <p className="text-gray-300 mb-2">
            <strong>Name:</strong> {message.fullName}
          </p>

          <p className="text-gray-300 mb-2">
            <strong>Email:</strong> {message.email}
          </p>

          <p className="text-gray-300 mb-2">
            <strong>Date:</strong>{" "}
            {new Date(message.createdAt).toLocaleString()}
          </p>

          <p className="text-gray-300 mb-4 whitespace-pre-line">
            <strong>Message:</strong> {message.message}
          </p>

          <button
            onClick={onClose}
            className="w-full mt-2 bg-[#00FFFF] text-[#11001C] py-2 rounded font-semibold hover:opacity-90 transition"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
