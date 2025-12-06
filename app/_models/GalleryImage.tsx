import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema({
    image: {type: mongoose.Schema.Types.ObjectId,  required: true}
},
{
    timestamps: true,
})