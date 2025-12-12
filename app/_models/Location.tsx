import mongoose from "mongoose";

// Main Schema for the Shipping Location
const locationSchema = new mongoose.Schema({
  // The official name of the port or hub (e.g., 'Algiers')
  name: {
    type: String,
    required: true,
    unique: true, // Locations should likely have unique names
    trim: true,
  },
  
  // *** NEW FIELD: The country (e.g., 'Algeria') ***
  country: {
    type: String,
    required: true,
    trim: true,
  },

  // The full address used for geocoding (e.g., 'Skikda, Algeria')
  // We'll keep this, but `name` and `country` are more specific to the popup.
  address: {
    type: String,
    trim: true, // Making this optional, as `name` + `country` may suffice
  },

  // Latitude coordinate (must stay)
  lat: {
    type: Number,
    required: true,
  },

  // Longitude coordinate (must stay)
  lng: {
    type: Number,
    required: true,
  },
  
  // *** NEW FIELD: The description from the popup ***
  // (e.g., 'North African logistics and port operations carrier')
  description: {
    type: String,
    required: true,
    trim: true,
  },

  // *** NEW FIELD: The operation status from the popup ***
  // (e.g., 'Active Operations')
  status: {
    type: String,
    // You might consider an enum for controlled values like 'Active', 'Planned', 'Inactive'
    enum: ['Active Operations', 'Planned Operations', 'Maintenance'], // Example enumeration
    default: 'Active Operations',
    required: true,
  },

}, { 
  timestamps: true // Adds createdAt and updatedAt fields
});

// Export the model
const Location = mongoose.models.Location || mongoose.model('Location', locationSchema);
export default Location;