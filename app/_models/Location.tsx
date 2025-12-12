import mongoose from "mongoose";

// Sub-schema for defining a shipping destination (as defined above)
const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
}, { _id: false });


// Main Schema for the Shipping Location
const locationSchema = new mongoose.Schema({
  // The official name of the port or hub (e.g., 'Port of Algiers')
  name: {
    type: String,
    required: true,
    unique: true, // Locations should likely have unique names
    trim: true,
  },
  
  // The full address used for geocoding (e.g., 'Skikda, Algeria')
  address: {
    type: String,
    required: true,
    trim: true,
  },

  // Latitude coordinate (obtained via LocationIQ)
  lat: {
    type: Number,
    required: true,
  },

  // Longitude coordinate (obtained via LocationIQ)
  lng: {
    type: Number,
    required: true,
  },


}, { 
  timestamps: true // Adds createdAt and updatedAt fields
});

// Export the model
const Location = mongoose.models.Location || mongoose.model('Location', locationSchema);
export default Location;