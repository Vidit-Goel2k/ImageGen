import express from 'express';
import * as dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';

import Post from '../mongodb/models/post.js';

// to make sure env variables populate
dotenv.config();

// make an instance of router
const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// GET ALL POSTS
router.route('/').get(async(req,res) => {
    try {
        // fetch all posts from DB
        const posts = await Post.find({});

        res.status(200).json({success: true, data: posts});

    } catch (error) {
	    res.status(500).json({success: false, message: error})
    }
});

// CREATE A POST
router.route('/').post(async(req,res) => {
    try {
	// fetch data from frontend
	    const{name, prompt, photo} = req.body;
	    
	    // create cloudinary photo optimised url by uploading the photo to cloudinary
	    const photoUrl = await cloudinary.uploader.upload(photo);
	
	    // create new post in DB
	    const newPost = await Post.create({
	        name,
	        prompt,
	        photo: photoUrl.url,
	    })
	
	    res.status(201).json({ success: true, data: newPost });
} catch (error) {
	res.status(500).json({success: false, message: error})
}

});

export default router;
