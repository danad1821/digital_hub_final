"use client";
import { useState, useEffect, useCallback } from "react";
import MetricCard from "@/app/_components/MetricCard";
import PendingMessagesTable from "../_components/PendingMessagesTable";
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

const TEXT_POP_COLOR = "text-[#FF5733]";

const BG_POP_COLOR = "bg-[#FF5733]";

export default function Admin() {
  const [messages, setMessages] = useState<any[]>([]);
  const [totalInquiries, setTotalInquiries] = useState<number>(0);
  const [pendingMessages, setPendingMessages] = useState<any[]>([]);
  const [responseRate, setResponseRate] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const getAllMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      // NOTE: Assuming your GET /api/messages route is ready to fetch all messages
      const res = await axios.get("/api/messages");
      const data = res.data?.messages ?? res.data ?? [];
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    try {
      // NOTE: This assumes a PATCH or PUT route exists like /api/messages?id=<id>
      const newStatus = !currentStatus;
      await axios.put(`/api/messages/${id}`, { isRead: newStatus });

      // Update local state immediately for a smooth UX
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
    const day = today.getDay(); // 0 = Sunday, 1 = Monday, ...
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

  const getWeeklyResponseRate = (msgs: any[] = messages) => {
    if (!msgs || msgs.length === 0) {
      setResponseRate(0);
      return;
    }

    // compute Monday-Sunday bounds (same as total inquiries)
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = (day + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    // helper to detect whether a message was responded to
    const isResponded = (m: any) => {
      if (!m) return false;
      // check several common shapes: replied flag, respondedAt/responseAt timestamps, reply/content presence
      if (m.replied === true || m.isReplied === true) return true;
      if (m.respondedAt || m.responseAt || m.repliedAt) {
        const d = new Date(m.respondedAt ?? m.responseAt ?? m.repliedAt);
        return !isNaN(d.getTime());
      }
      // sometimes you store reply content on the message
      if (typeof m.reply === "string" && m.reply.trim().length > 0) return true;
      if (typeof m.response === "string" && m.response.trim().length > 0)
        return true;
      return false;
    };

    const thisWeek = msgs.filter((m) => {
      if (!m?.createdAt) return false;
      const created = new Date(m.createdAt);
      return created >= monday && created <= sunday;
    });

    const total = thisWeek.length;
    if (total === 0) {
      setResponseRate(0);
      return;
    }

    const responded = thisWeek.filter(isResponded).length;
    const pct = Math.round((responded / total) * 100);
    setResponseRate(pct);
  };

  useEffect(() => {
    getAllMessages();
  }, []);

  useEffect(() => {
    getTotalWeeklyInqueries(messages);
    getPendingMessages(messages);
    getWeeklyResponseRate(messages);
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A1C30] text-white">
        <Loader className="w-10 h-10 animate-spin mr-3" />
        <p className="text-xl">Loading Dashboard Data...</p>
      </div>
    );
  }

  return (
    <main>
      <h1>Alta Maritime Admin Dashboard</h1>
      <section className="flex items-center justify-center gap-5 flex-wrap p-2">
        <MetricCard
          title="Total Inquiries"
          value={totalInquiries.toString()}
          icon={Mail}
          colorClass="text-red-600"
        />
        <MetricCard
          title="Pending Follow-ups"
          value={pendingMessages.length.toString()}
          icon={Clock}
          colorClass="text-yellow-600"
        />
        <MetricCard
          title="Response Rate"
          value={`${responseRate}%`}
          icon={CheckCircle}
          colorClass="text-green-600"
        />
      </section>
      {/* Messages Table & Service Management */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 custom-container">
        {/* Recent Inquiries Table (2/3 width) */}
        <div className="lg:col-span-2 bg-[#1B2B40] p-6 rounded-xl shadow-2xl border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
            <MessageSquare className={`w-6 h-6 mr-2 ${TEXT_POP_COLOR}`} />
            Pending Inquiries ({pendingMessages.length})
          </h3>
          <PendingMessagesTable
            pendingMessages={pendingMessages}
            onToggleRead={toggleReadStatus}
          />
        </div>

        {/* Service Management Actions (1/3 width) */}
        <div className="lg:col-span-1 bg-[#1B2B40] p-6 rounded-xl shadow-2xl border border-gray-700 h-fit">
          <h3 className="text-2xl font-bold text-white mb-6">
            Manage Services
          </h3>
          <div className="space-y-4">
            <button
              className={`w-full flex items-center justify-center px-4 py-3 ${BG_POP_COLOR} text-[#0A1C30] font-semibold rounded-lg shadow-lg hover:bg-orange-400 transition duration-200`}
            >
              <Ship className="w-5 h-5 mr-2" /> Add New Service
            </button>
            <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-500 transition duration-200">
              <Clock className="w-5 h-5 mr-2" /> Edit Existing Service
            </button>
            <button className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-500 transition duration-200">
              <XCircle className="w-5 h-5 mr-2" /> Delete Service
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
