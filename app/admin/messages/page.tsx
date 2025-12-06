"use client";

import axios from "axios";
import PendingMessagesTable from "@/app/_components/PendingMessagesTable";
import AllMessagesTable from "@/app/_components/AllMessagesTable";
import MessageModal from "@/app/_components/MessageModal";

import { useState, useEffect, useCallback } from "react";

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [pendingMessages, setPendingMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const getAllMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/messages");
      const data = res.data?.messages ?? res.data ?? [];
      setMessages(Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : []);
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

      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, isRead: newStatus } : m))
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteMessage = async (id: any)=>{
    try{
        await axios.delete(`/api/messages/${id}`);
        const filteredMessage = messages.filter((m)=>m._id !== id);
        setMessages(filteredMessage);

    }catch(error){
        console.error(error)
    }
  }

  const getPendingMessages = (msgs: any[] = messages) => {
    setPendingMessages(msgs.filter((m) => m.isRead === false));
  };

  useEffect(() => {
    getAllMessages();
  }, []);

  useEffect(() => {
    getPendingMessages(messages);
  }, [messages]);

  return (
    <main className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-black">Messages</h1>

      {/* Pending Messages */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-black">Pending Messages</h2>
        <PendingMessagesTable
          pendingMessages={pendingMessages}
          onToggleRead={toggleReadStatus}
          onRowClick={(msg: any) => setSelectedMessage(msg)}
        />
      </div>

      {/* All Messages */}
      <div>
        <h2 className="text-2xl font-semibold text-black">All Messages</h2>
        <AllMessagesTable
          messages={messages}
          onRowClick={(msg: any) => setSelectedMessage(msg)}
          onDeleteMessage={deleteMessage}
        />
      </div>

      {/* Modal */}
      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </main>
  );
}
