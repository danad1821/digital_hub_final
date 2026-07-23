// src/app/types/index.ts

export type Stat = {
  label: string;
  value: string;
};

export type Service = {
  id: string;
  serviceName: string;
  shortDescription: string;
  // Add other service properties as needed
};

export type Location = {
  id?: string | number;
  country: string;
  name: string;
  address?: string;
  description?: string;
  status?: string;
  type?: "agent" | "partner" | "coming-soon";
  emails?: string;
  phones?: string;
  lat?: number;
  lng?: number;
};

export type GalleryImage = {
  id: string;
  image: string;
  title: string;
  // Add other gallery properties as needed
};

export type PageSectionData = {
  title: string;
  subtitle: string;
  data: {
    image_ref?: string;
    button1_text?: string;
    button2_text?: string;
    stats_list?: Stat[];
    email?: string;
    phone?: string;
    hq? :string;
    // Add other section-specific data fields
  };
};

export type HomePageData = {
  id: string;
  sections: PageSectionData[];
  // Add other top-level page data
};

// Type for the scroll handler map keys
export type SectionId =
  | "services"
  | "about"
  | "gallery"
  | "locations"
  | "contact";

// Type for the scroll handler function
export type ScrollHandler = (sectionId: SectionId) => void;