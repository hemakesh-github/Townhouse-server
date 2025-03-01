import { Router } from "express";
import * as marked from "marked";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
import { Prompt, PromptResponse } from "../types";
import {
    verifyEmail,
    createAccount,
    login,
    protectUser,
    getUsers,
    getUserDetails,
    authenticateUserWithAccessToken,
} from "../controllers"
config();

let router=Router()

// Access your API key as an environment variable (see "Set up your API key" above)
let apiKey:any=process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

router.post("/prompt",async(req:Prompt,res:any)=>{
    try {
        let { prompt }= req.body;
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        const result = await model.generateContent(prompt);
        const response = result.response;
        let promptResponse:PromptResponse={
            prompt,
            text: marked.parse(response.text())
        }
        res.status(200).send(promptResponse)
    } catch (error:any) {
        res.status(500).send({error:error.message})
        console.log(error.message)
    }
})

router.post('/verify',verifyEmail)
router.post("/sign_up",createAccount)
router.post('/sign_in',login)
router.get('/users',protectUser,getUsers)
router.get('/authenticate/:access_token', authenticateUserWithAccessToken)
router.get('/users/:email',protectUser,getUserDetails)

export default router;
