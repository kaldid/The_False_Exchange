
import express from 'express'
import cors from 'cors'
import axios from 'axios'
import connectDB from './mongodb.js'
import authMiddleware from './auth.js'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import {loginUser,registerUser} from './controllers/UserControllers.js'
import { amendOrder, cancelOrder, getActiveOrders, placeOrder } from './controllers/OrderController.js'
import { getPortfolioByUserId } from './controllers/PortfolioController.js'
import jwt from "jsonwebtoken"
const PORT = process.env.PORT || 8000

const app=express();

// app.use((req,res)=>res.send('hi'))
app.use(cookieParser()); 
app.use(express.json())
app.use(cors({
    origin: '/', // your frontend URL
    credentials: true, // Allow cookies
}))
app.use(express.urlencoded({ extended: true }));
await connectDB();

app.post('/login',loginUser)

app.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'None',
        secure: true, // true if you're using HTTPS
    });
    res.json({ success: true, message: 'Logged out successfully' });
});

app.post('/register',registerUser)

app.post('/guarded',authMiddleware,async(req,res)=>{

    res.json({message:'logged in '})

})

// app.use(authMiddleware)
app.post('/placeOrder', authMiddleware,placeOrder)
app.post('/amendOrder', authMiddleware,amendOrder)
app.post('/cancelOrder',authMiddleware , cancelOrder)

app.get('/getportfolio',authMiddleware,getPortfolioByUserId)
app.get('/getorders',authMiddleware,getActiveOrders)

app.post('/amendOrder', amendOrder);
app.post('/cancelOrder', cancelOrder);

app.get("/verifyToken", (req, res) => {
    const token = req.cookies.token;
    // console.log("cookies: ",req.cookies)
    
    if (!token) return res.status(401).json({ success: false, message: "No token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ success: true, username: decoded.username });
    } catch (err) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
});



app.listen(PORT , ()=>console.log('server running on port '+ PORT))
