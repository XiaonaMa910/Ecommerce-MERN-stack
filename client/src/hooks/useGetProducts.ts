import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { IShopContext, ShopContext } from "../context/shop-context";

export const useGetProducts = () => {
  const [products, setProducts] = useState([]);
  const {isAuthenticated}=useContext<IShopContext>(ShopContext)
  const fetchProducts = async () => {
    const products = await axios.get("http://localhost:3001/product");
    setProducts(products.data);
  };

  useEffect(() => {
    if (isAuthenticated){
    fetchProducts();
    }
  }, [isAuthenticated]);
  //console.log('产品:',products)

  return { products, fetchProducts };
};