import {Song} from "../models/song.model.js";
import {Album} from "../models/album.model.js";
export const createSong = async(req,res) => {
    try {
        if(!req.files || !req.files.audioFile || !req.file.imageFile){
            return res.status(400).jason({message:"Please upload all files"});
        }

        const { title, artist, albumId, duration }= req.body
        const audioFile  = req.files.audioFile
        const imageFile = req.files.imageFile

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
        res.status(500).jason({message:"Internal Server error",error});
    }
};