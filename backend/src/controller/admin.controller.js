import {Song} from "../models/song.model.js";
import {Album} from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js"; 

const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath,{
            resource_type:"auto",

        }
    )
    return result.secure_url
    } catch (error) {
        console.log("Error is uploadToCloudinary",error);
        throw new Error("Error uploading to cloudinary");
    }
}

export const createSong = async(req,res,next) => {
    try {
        if(!req.files || !req.files.audioFile || !req.file.imageFile){
            return res.status(400).jason({message:"Please upload all files"});
        }

        const { title, artist, albumId, duration }= req.body
        const audioFile  = req.files.audioFile
        const imageFile = req.files.imageFile

        const audioUrl = await uploadToCloudinary(audioFile);
        const imageUrl = await uploadToCloudinary(imageFile);

        const song = new  Song({
            title,
            artist,
            audioUrl,
            imageUrl,
            duration,
            albumId:albumId || null

        });

        await song.save();

        if(albumId){
            await Album.findByIdAndUpdate(albumId,{
                $push:{songs:song._id},
            });
        }
        res.status(201).jason(song)
    } catch (error) {
        console.log("Error is createSong",error);
        //res.status(500).jason({message:"Internal Server error",error});
        next(error);
    }
};

export const deleteSong = async(req,res,next) => {
    try {
        const { id } = req.params

        const song = await Song.findById(id)
        if (song.albumId){
            await Album.findByIdAndUpdate(song.albumId,{
                $pull : {songs : song._id},
            })
        }
        await Song.findByIdAndDelete(id)
        res.status(200).json({message:"Song deleted successfully"});
    } catch (error) {
        console.log("Error in deletingSong",error);
        next(error);
    }
};

export const createAlbum = async(req,res,next) => {
    try {
        const {title,artist,releaseYear} = req.body
        const {imageFile} = req.files

        const imageUrl = await uploadToCloudinary(imageFile);

        const album = new Album({
            title,
            artist,
            imageUrl,
            releaseYear
        })
        await album.save()
        res.status(200).jason(album)
    } catch (error) {
        console.log("Error in createAlbum",error);
        next(error);
    }
};

export const deleteAlbum = async(req,res,next) => {
    try {
        const{ id } = req.params;
        await Song.deleteMany({albumId:id});
        await Album.findByIdAndDelete(id);
        res.status(200).jason({message:"Album deleted Successfully "});
    } catch (error) {
        console.log("Error in deleteAlbum",error);
        next(error);
    }

};

export const checkAdmin = async(req,res,next) =>{
    res.status(200).json({admin:true});
}