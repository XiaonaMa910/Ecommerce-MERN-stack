import { useContext } from "react"
import { IShopContext, ShopContext } from "../../context/shop-context"
import { useGetProducts } from "../../hooks/useGetProducts"
import { Product } from "../shop/product"
import { IProduct } from "../../models/interface"
import { CartItem } from "./cart-item"
import { useNavigate } from "react-router-dom"
import "./style.css";

export const CheckoutPage=()=>{
    const {getCartItemCount,getTotalAmount, checkout}=useContext<IShopContext>(ShopContext)
    const totalAmount=getTotalAmount()
    const {products}=useGetProducts()
    const navigate=useNavigate()
    //console.log("yonghu de ID:",localStorage.getItem("userID"))
    return(
        <div className="cart">
            <div>
                <h1>Your Cart Items</h1>
            </div>
            <div className="cart">
                {products?.map((product:IProduct)=>{
                    if (getCartItemCount(product._id)!==0){
                        return <CartItem product={product}/>
                    } 
                })}

            </div>
            {totalAmount>0 ? (
                <div className="checkout">
                    <p>Subtotal:${totalAmount}</p>
                    <button onClick={()=>navigate("/")}>Continue Shopping</button>
                    <button onClick={checkout}>Checkout</button>
                </div>

            ):(
                <h3>Your Shopping Cart is Empty</h3>
                
            )}

        </div>
    )
}