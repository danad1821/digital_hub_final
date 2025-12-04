import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';

// This globally-scoped variable acts as the cache. 
// In a serverless/Next.js environment, this persists across requests in the same warm container.
let gfsBucket: any; 

/**
 * Creates and returns a GridFSBucket instance, ensuring it's only created once 
 * per active Mongoose connection instance for performance optimization (caching).
 * @returns {GridFSBucket} The cached or newly created GridFSBucket instance.
 */
export default function getGridFSBucket() {
    // 1. Caching Check: If the bucket instance already exists, return it immediately.
    if (gfsBucket) {
        console.log("Returning cached GridFSBucket.");
        return gfsBucket;
    }

    // 2. Connection Check: Ensure Mongoose is connected before trying to access the database.
    if (mongoose.connection.readyState !== 1) {
        throw new Error("Mongoose connection is not established (readyState is not 1). Cannot create GridFSBucket.");
    }

    // Access the raw MongoDB driver database instance
    // Note: We cast to 'any' here because Mongoose's types for 'db' might be generic.
    const db: any = mongoose.connection.db;

    // 3. Instance Creation: If not cached, create the new bucket instance.
    gfsBucket = new GridFSBucket(db, {
        bucketName: 'service_images' // Collections will be named service_images.files and service_images.chunks
    });
    
    console.log("Created new GridFSBucket and cached it.");
    
    return gfsBucket;
}