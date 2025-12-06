import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema({
    image: {type: mongoose.Schema.Types.ObjectId,  required: true}
},
{
    timestamps: true,
})

const GalleryImage = mongoose.models.GalleryImage || mongoose.model("GalleryImage", galleryImageSchema);

export default GalleryImage;