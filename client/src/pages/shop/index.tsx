import { useCookies } from "react-cookie"
import { useGetProducts } from "../../hooks/useGetProducts" 
import { Navigate } from "react-router-dom"
import { Product } from "./product"
import { useContext, useState } from "react"
import "./style.css"
import { IShopContext, ShopContext } from "../../context/shop-context"

export const ShopPage = () => {
    const {products } = useGetProducts(); 
    //const {isAuthenticated}=useContext<IShopContext>(ShopContext)
    const [cookies] = useCookies(['access_token']);

   
    if (!cookies.access_token) {
        return <Navigate to="/auth" />;
    }

    return (
        <div className="shop">
            <div className="products">
                {products?.map((product) => (
                    <Product key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
    
};
