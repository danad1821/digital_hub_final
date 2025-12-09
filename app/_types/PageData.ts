// types/PageData.ts

// Interface for a single core value item
export interface CoreValue {
    key: string;      // Used for React lists (UUID/short string)
    icon: string;
    name: string;
    description: string;
}

// Interface for the data object within the Core Values section
export interface CoreValuesData {
    title: string;
    intro_text: string;
    values: CoreValue[];
}

// Base interface for a section (the `data` property will vary)
export interface PageSection<T> {
    order: number;
    type: string;
    data: T;
}

// Define the structure of the full Page Document
export interface PageDocument {
    _id: string; // This will be the MongoDB ObjectId
    slug: string;
    page_title: string;
    status: 'published' | 'draft';
    last_updated: string;
    sections: PageSection<any>[]; // Use 'any' for the mixed section types
}

// Example type for API response structure
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}