import { useContext, useState } from "react";
import { IProduct } from "../../models/interface";
import { IShopContext, ShopContext } from "../../context/shop-context";

interface Props{
    product:IProduct
}
export const Product=(props:Props)=>{
    const {_id, productName, description, price, stockQuantity, imageURL } =
    props.product;
    const {addToCart,getCartItemCount}=useContext<IShopContext>(ShopContext)
    const count=getCartItemCount(_id)
    return(
        <div className="product">
            <img src={imageURL}/>
            <div className="description">
                <h3>{productName}</h3>
                <p>{description}</p>
                <p>${price}</p>
            </div>
            <button className="addToCartBttn" onClick={()=>addToCart(_id)}>
                Add To Cart{count>0 && (<>({count})</>)}</button>
            <div className="stockQuantity">
                {stockQuantity===0 && <h5>OUT OF QUANTITY</h5>}

            </div>
        

        </div>
    )
}
