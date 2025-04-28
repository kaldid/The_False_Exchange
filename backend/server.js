
import express from 'express'
import cors from 'cors'
import axios from 'axios'
import connectDB from './mongodb.js'
import authMiddleware from './auth.js'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import {loginUser,registerUser} from './controllers/UserControllers.js'
import { amendOrder, cancelOrder, placeOrder } from './controllers/OrderController.js'

const PORT = process.env.PORT || 8000

const app=express();

// app.use((req,res)=>res.send('hi'))
app.use(cookieParser()); 
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000', // your frontend URL
    credentials: true, // Allow cookies
}))
app.use(express.urlencoded({ extended: true }));
await connectDB();

app.post('/login',loginUser)



app.post('/register',registerUser)

app.post('/guarded',authMiddleware,async(req,res)=>{

    res.json({message:'logged in '})

})

app.use(authMiddleware)
app.post('/placeOrder', placeOrder)
app.post('/amendOrder', amendOrder)
app.post('/cancelOrder' , cancelOrder)










app.listen(PORT , ()=>console.log('server running on port '+ PORT))
