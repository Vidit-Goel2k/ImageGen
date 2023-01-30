import express from 'express';
import * as dotenv from 'dotenv';
import {Configuration, OpenAIApi } from 'openai';


// to make sure env variables populate
dotenv.config();

// console.log(process.env.OPENAI_API_KEY); 
// make an instance of router
const router = express.Router();

// make a new variable called configuration 
const configuration  = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // an object as the first and only parameter
})

// instance of openAi
const openai = new OpenAIApi(configuration);

// demo route to test router 
router.route('/').get((req,res) => {
    // console.log(process.env.OPENAI_API_KEY);
    res.send('Hello from Dall-E!');
    
})

// actual route to openAiApi  by using post     // async necessary as it will take time
router.route('/').post(async (req,res) =>{
    try {
        // fetch prompt from frontend
        const {prompt} = req.body;

        const aiResponse = await openai.createImage({
            prompt,
            n:1, // no of img
            size: '256x256',
            response_format: 'b64_json',
        });

        // extracting image from aiResponse
        const image = aiResponse.data.data[0].b64_json;
        // console.log(image)

        // sending image to frontend
        res.status(200).json({ photo: image });
        
    } catch (error) {
        console.log(error);
        res.status(500).send(error?.response.data.error.message);
    }
})

export default router;