"use client";
import { useState, useEffect, useCallback } from "react";
import MetricCard from "@/app/_components/MetricCard";
import PendingMessagesTable from "../_components/PendingMessagesTable";
import MessageModal from "../_components/MessageModal"; // ⬅ IMPORT MODAL
import {
  Mail,
  Clock,
  CheckCircle,
  Ship,
  MessageSquare,
  Loader,
  XCircle,
} from "lucide-react";
import axios from "axios";

const TEXT_POP_COLOR = "text-[#00FFFF]";
const BG_POP_COLOR = "bg-[#00FFFF]";

export default function Admin() {
  const [messages, setMessages] = useState<any[]>([]);
  const [totalInquiries, setTotalInquiries] = useState<number>(0);
  const [pendingMessages, setPendingMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const getAllMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/messages");
      const data = res.data?.messages ?? res.data ?? [];
      setMessages(
        Array.isArray(data)
          ? data.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
          : []
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      await axios.put(`/api/messages/${id}`, { isRead: newStatus });

      setMessages((prevMsgs) =>
        prevMsgs.map((msg) =>
          msg._id === id ? { ...msg, isRead: newStatus } : msg
        )
      );
    } catch (error) {
      console.error("Error toggling message status:", error);
    }
  };

  const getTotalWeeklyInqueries = (msgs: any[] = messages) => {
    if (!msgs || msgs.length === 0) {
      setTotalInquiries(0);
      return;
    }

    const today = new Date();
    const day = today.getDay();
    const diffToMonday = (day + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const count = msgs.filter((m: any) => {
      if (!m?.createdAt) return false;
      const created = new Date(m.createdAt);
      return created >= monday && created <= sunday;
    }).length;

    setTotalInquiries(count);
  };

  const getPendingMessages = (msgs: any[] = messages) => {
    if (!msgs || msgs.length === 0) {
      setPendingMessages([]);
      return;
    }
    const filteredMsgs = msgs.filter((m) => m.isRead === false);
    setPendingMessages(filteredMsgs);
  };

  useEffect(() => {
    getAllMessages();
  }, []);

  useEffect(() => {
    getTotalWeeklyInqueries(messages);
    getPendingMessages(messages);
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#11001C] text-white">
        <Loader className="w-10 h-10 animate-spin mr-3" />
        <p className="text-xl">Loading Dashboard Data...</p>
      </div>
    );
  }

  return (
    <main className="py-6">
      <h1 className="text-4xl sm:text-5xl font-bold my-8 tracking-tight text-center">
        Dashboard
      </h1>

      <section className="flex items-center justify-center gap-5 flex-wrap p-2">
        <MetricCard
          title="Total Inquiries"
          value={totalInquiries.toString()}
          icon={Mail}
          colorClass="text-red-400"
        />
        <MetricCard
          title="Pending Follow-ups"
          value={pendingMessages.length.toString()}
          icon={Clock}
          colorClass="text-yellow-400"
        />
      </section>

      <section className="flex flex-wrap gap-5 items-start justify-center w-full">
        <div className="bg-[#0A1C30] p-6 rounded-xl shadow-2xl border border-gray-600">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
            <MessageSquare className={`w-6 h-6 mr-2 ${TEXT_POP_COLOR}`} />
            Pending Inquiries ({pendingMessages.length})
          </h3>

          <PendingMessagesTable
            pendingMessages={pendingMessages}
            onToggleRead={toggleReadStatus}
            onRowClick={(msg: any) => setSelectedMessage(msg)} // ⬅ NEW
          />
        </div>

        <div className="bg-[#0A1C30] p-6 rounded-xl shadow-2xl border border-gray-600 h-fit">
          <h3 className="text-2xl font-bold text-white mb-6">
            Manage Services
          </h3>
          <div className="space-y-4">
            <button
              className={`w-full flex items-center justify-center px-4 py-3 ${BG_POP_COLOR} text-[#11001C] font-semibold rounded-lg shadow-lg hover:bg-[#00D1E6] transition duration-200`}
            >
              <Ship className="w-5 h-5 mr-2" /> Add New Service
            </button>
            <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-500 transition duration-200">
              <Clock className="w-5 h-5 mr-2" /> Edit Existing Service
            </button>
          </div>
        </div>
      </section>

      {/* ⬇ NEW: Display modal */}
      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </main>
  );
}
