import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../models/User.js'



const registerUser = async (req,res)=>{
    try {
        const {username,email,password} = req.body;
        if(!username || !email || ! password){
            return res.json({success:false,message:"Missing Details"})

        }
        const existingUser = await User.findOne({username:username});
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });

        }

        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password,salt)

        // object that store user information 

        const userData ={
            username,email,password:hashedPassword
        } 
        const newUser = new User(userData) // mew user store details in mondobv data baser 

        const user = await newUser.save()

        res.json({ message: 'Signup successful' });

        // const token  = jwt.sign({id:user._id},process.env.JWT_SECRET)

        // res.json({success:true,token,user:{name:user.username}})



        
    } catch (error) {

        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

const loginUser = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const user = await User.findOne({ username });
      if (!user) {
        return res.json({ success: false, message: "User does not exist" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.json({ success: false, message: "Invalid Credentials" });
      }
  
      const payload = {
        id: user._id,
        username: username,
        email: user.email,
      };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET);
  
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // true if HTTPS (set later)
        sameSite: 'Strict',
        maxAge: 60 * 60 * 1000, // 1 hour
      });
  
      return res.json({ success: true, message: 'Login successful' });
  
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  

export{loginUser,registerUser}