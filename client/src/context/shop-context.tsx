import { createContext, useEffect, useState } from "react"
import { useGetProducts } from "../hooks/useGetProducts";
import { IProduct } from "../models/interface";
import { useGetToken } from "../hooks/UseGetToken";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export interface IShopContext{
    addToCart:(itemId:string)=>void;
    removeFromCart:(itemId:string)=>void;
    updateCartItemCount:(newAmount:number,itemId:string)=>void
    getCartItemCount:(itemId:string)=>number
    getTotalAmount:()=>number
    checkout:()=>void
    fetchAvailableMoney:()=>void
    availableMoney: number
    purchasedItems: IProduct[]
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;


}
const defaultVal: IShopContext={
    addToCart:()=>null,
    removeFromCart:()=>null,
    updateCartItemCount:()=>null,
    getCartItemCount:()=>0,
    getTotalAmount:()=>null,
    checkout:()=>null,
    fetchAvailableMoney:()=>null,
    purchasedItems:[],
    isAuthenticated: true,
    setIsAuthenticated: (isAuthenticated: boolean) => null,

    
    availableMoney: 0
    
}
export const ShopContext = createContext<IShopContext>(defaultVal);
export const ShopContextProvider=(props:any)=>{
    const [cartItems,setCartItems]=useState<Record<string, number>>({})
    const getCartItemCount=(itemId:string)=>{
        if (itemId in cartItems){
            return cartItems[itemId]
        }
        return 0
   
    }
    const addToCart=(itemId:string)=>{
        if (!cartItems[itemId]){
            setCartItems((prev)=>({...prev,[itemId]:1}))
        }else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
    }
    const removeFromCart=(itemId:string)=>{
        if (!cartItems[itemId]) return
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
    }
    const updateCartItemCount=(newAmount:number,itemId:string)=>{
        setCartItems((prev)=>({...prev,[itemId]:newAmount}))
    }
    const {products}=useGetProducts()
    const getTotalAmount=()=>{
        if (products.length===0) return 0
        let totalAmount=0
        for (const item in cartItems){
            if (cartItems[item]>0){
                let itemInfo:IProduct=products.find((product)=>product._id===item)
                totalAmount=totalAmount+itemInfo.price * cartItems[item]
            }
        }
        return Number(totalAmount.toFixed(2))

    }
    const {header}=useGetToken()
    const navigate=useNavigate()
    const checkout= async()=>{
        try{
            const customerID=localStorage.getItem("userID")
            const body={customerID,cartItems}
            console.log('testID:',localStorage.getItem("userID"))
            //const test=await axios.get("http://localhost:3001/user/test")
            const res=await axios.post('http://localhost:3001/product/checkout',body,{headers:header})
            setCartItems({})
            fetchAvailableMoney()
            fetchPurchasedItems()
            navigate('/')
                
            
        }catch(err){
            console.log('你的错误：',err)
        }
    }
    const [availableMoney, setAvailableMoney] = useState<number>(defaultVal.availableMoney);
    const fetchAvailableMoney = async () => {
        //console.log(333);
        const userID = localStorage.getItem('userID');
        const res = await axios.get(`http://localhost:3001/user/available-money/${userID}`, { headers: header });
        setAvailableMoney(res.data.availableMoney);
        //console.log(res.data.availableMoney)
        

        
    };
    useEffect(() => {
        console.log(availableMoney);
    }, [availableMoney]);
    
    
    
    
    const [purchasedItems,setPurchasedItems]=useState<IProduct[]>([])
    const fetchPurchasedItems = async () => {
        //console.log(333);
        const userID = localStorage.getItem('userID');
        const res = await axios.get(`http://localhost:3001/product/purchased-items/${userID}`, { headers: header });
        setPurchasedItems(res.data.purchasedItems);
    }
    const [cookies,setCookies]=useCookies(['access_token'])
    const [isAuthenticated,setIsAuthenticated]=useState<boolean>(cookies.access_token!==null)
    useEffect(()=>{
        if (isAuthenticated){
        fetchAvailableMoney()
        fetchPurchasedItems()
        }
    },[isAuthenticated])

    useEffect(()=>{
        if (!isAuthenticated){
        localStorage.clear()
        setCookies('access_token',null)
        }
    },[isAuthenticated])
    
    
    
    const contextValue:IShopContext={
        addToCart,
        removeFromCart,
        updateCartItemCount,
        getCartItemCount,
        getTotalAmount,
        fetchAvailableMoney,
        checkout,
        
        availableMoney,
        purchasedItems,
        isAuthenticated,
        setIsAuthenticated,

    }
    return(
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}