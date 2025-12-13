"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import HomePageEditor from "@/app/_components/page_editing_components/HomePageEditor";

export default function AdminEditPages() {
  const [pages, setPages] = useState([]);
  const [selectedPage, setselectedPage] = useState("home");

  const getAllPages = async () => {
    try {
      const response = await axios.get("/api/pages");
      console.log(response);
      setPages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllPages();
  }, []);
  return (
    <main>
      <HomePageEditor />:
    </main>
  );
}
