"use client";
import { useState, useEffect } from "react";
import AboutPageEditor from "@/app/_components/page_editing_components/AboutPageEditor";
import axios from "axios";
import HomePageEditor from "@/app/_components/page_editing_components/HomePageEditor";
import ServicesPageEditor from "@/app/_components/page_editing_components/ServicesPageEditor";
import GalleryPageEditor from "@/app/_components/page_editing_components/GalleryPageEditor";
import LocationsPageEditor from "@/app/_components/page_editing_components/LocationsPageEditor";
export default function AdminEditPages(){
    const [pages, setPages] = useState([]);
    const [selectedPage, setselectedPage] = useState('home')

    const getAllPages = async()=>{
        try{
            const response = await axios.get('/api/pages');
            console.log(response)
            setPages(response.data)

        }catch(error){
            console.error(error);
        }
    }

    useEffect(()=>{
        getAllPages();
    }, [])
    return(
        <main>
            <div>
                <h1>Pages</h1>
                <div>
                    <label htmlFor="">Currently Editing:</label>
                    <select name="" id="" onChange={(e)=>setselectedPage(e.target.value)} value={selectedPage}>
                        {
                            pages.map((p: any)=>(
                                <option key={p._id} value={p.slug}>{p.page_title}</option>
                            ))
                        }
                    </select>
                </div>
            </div>
            <>
                {
                    selectedPage === "home" ? <HomePageEditor/>:
                         selectedPage === "about-us" ? (<AboutPageEditor/>):
                         selectedPage === "services"? (<ServicesPageEditor/>):
                         selectedPage ==="gallery"?(<GalleryPageEditor/>):
                         selectedPage === "locations" ? (<LocationsPageEditor/>):(<></>)
                    
                
                }
            </>
        </main>
    )
}