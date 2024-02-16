import { Router,Request,Response } from "express";
import { ProductModel } from "../models/products";
import { verifyToken } from "./user";
import { UserModel } from "../models/user";
import { ProductErrors, UserErrors } from "../errors";

const router=Router()

router.get("/",async (_,res:Response)=>{
    try{
        const products=await ProductModel.find({})
        res.json(products)
        console.log(111)
    } catch(err){
        res.status(400).json(err)
    }
})
router.post('/checkout',verifyToken, async(req:Request,res:Response)=>{
    console.log(req.body)
    const {customerID,cartItems}=req.body
    try{
        const user=await UserModel.findById(customerID)
        const productIDs=Object.keys(cartItems)
        const products=await ProductModel.find({_id:{$in:productIDs}})
        if (!user){
            return res.status(400).json({type: ProductErrors.NO_USER_FOUND})
        }
        if (products.length!==productIDs.length){
            return res.status(400).json({type:ProductErrors.NO_PRODUCT_FOUND})
        }
        let totalprice=0
        for (const item in cartItems){
            const product=products.find((product)=>String(product._id)===item)
            if (!product){
                return res.status(400).json({type:ProductErrors.NO_PRODUCT_FOUND})
            }
            if (product.stockQuantity<cartItems[item]){
                return res.status(400).json({ type: ProductErrors.NOT_ENOUGH_STOCK })
            }
            totalprice=totalprice+product.price*cartItems[item]

        }
        if (user.availableMoney<totalprice){
            return res.status(400).json({ type: ProductErrors.NO_AVAILABLE_MONEY })
        }
        user.availableMoney=user.availableMoney-totalprice
        user.purchasedItems.push(...productIDs)
        await user.save()
        await ProductModel.updateMany(
            {_id:{$in:productIDs}},
            {$inc:{stockQuantity:-1}}
        )
        res.json({purchasedItems:user.purchasedItems})

    } catch (err){
        console.log(err)
    }
})
router.get('/purchased-items/:customerID',verifyToken,async(req:Request,res:Response)=>{
    const {customerID}=req.params
    try{
        const user=await UserModel.findById(customerID)
        if (!user){
            res.status(400).json({type:UserErrors.NO_USER_FOUND})
        }
        const products=await ProductModel.find({_id:{$in:user.purchasedItems}})
        res.json({purchasedItems:products})
    } catch(err){
        res.status(400).json({err})
    }
})

export {router as productRouter}