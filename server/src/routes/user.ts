import {Router,Request,Response} from "express"
import { IUser, UserModel } from "../models/user"
import { UserErrors } from "../errors"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import { json } from "stream/consumers"

const router=Router()



router.post('/register',async (req:Request,res:Response)=>{
    console.log('1succeed')
    const {username,password}=req.body
    console.log('2succeed')
    const user=await UserModel.findOne({username})
    if (user){
        return res.status(400).json({type:UserErrors.USERNMAE_ALREADY_EXISTS})
    }
    const hashedPassword=await bcrypt.hash(password,10)
    const newUser=new UserModel({username,password:hashedPassword})
    await newUser.save()

    res.json({message:"User Registered Successfully"})

})
router.post('/login',async(req:Request,res:Response)=>{
    const {username,password}=req.body
    try{
        const user:IUser=await UserModel.findOne({username})
        if (!user){
            return res.status(400).json({type:UserErrors.NO_USER_FOUND})
        }
        const isPasswordValid=await bcrypt.compare(password,user.password)
        if (!isPasswordValid){
            return res.status(400).json({type:UserErrors.WRONG_CREDENTIALS})
        }
        const token=jwt.sign({id:user._id},"secret")
        res.json({token,userID:user._id})

    }catch(err){
        res.status(500).json({type:err})
    }
})
export const verifyToken=(req,res,next)=>{
    const authHeader=req.headers.authorization
    if (authHeader){
        jwt.verify(authHeader,'secret',(err)=>{
            if (err){
                return res.sendStatus(403)
            }
            next()
        })
    } else{
        res.sendStatus(401)
    }
}
router.get('/available-money/:userID', verifyToken, async (req, res) => {
    const { userID } = req.params;
    console.log('availablemoney');
    try {
        const user = await UserModel.findById(userID);
        if (!user) {
            return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
        }
        res.json({ availableMoney: user.availableMoney });
    } catch (err) {
        res.status(500).json({ type: err });
    }
});


export {router as userRouter}