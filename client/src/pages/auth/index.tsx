import { useContext, useState } from "react"
import axios from "axios"
import { UserErrors } from "../../errors"
import { useCookies } from "react-cookie"
import { Navigate, useNavigate } from "react-router-dom"
import { IShopContext, ShopContext } from "../../context/shop-context"
import "./style.css";

export const AuthPage=()=>{
    return(
        <div className="auth">
            <Register />
            <Login />

        </div>
    )
}
const Login=()=>{
    const [username,setUsername]=useState<string>('')
    const [password,setPassword]=useState<string>('')
    const [_,setCookies]=useCookies(['access_token'])
    const navigate=useNavigate()
    const {isAuthenticated,setIsAuthenticated}=useContext<IShopContext>(ShopContext)
    const handleSubmit=async (event:any)=>{
        event.preventDefault()
        try{
            const result=await axios.post('http://localhost:3001/user/login',
            {username,password})
            setCookies('access_token',result.data.token)
            window.localStorage.setItem("userID",result.data.userID)
            setIsAuthenticated(true)
            navigate('/')
        } catch(err:any){
            let errMessage:string=""
            switch (err.response.data.type){
                case UserErrors.USERNMAE_ALREADY_EXISTS:
                    errMessage='User already exists '
                    break
                case UserErrors.WRONG_CREDENTIALS:
                    errMessage="Wrong username or password"
                    break
                default:
                    errMessage='Something went wrong'
            }
            alert('Error:'+errMessage)
            

        }

    }
    return(
        <div className="auth-container" >
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="username">
                        Username:

                    </label>
                    <input type="text" 
                    id="username" 
                    onChange={(event)=>{setUsername(event.target.value)}}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">
                        Password:

                    </label>
                    <input type="password" 
                    id="password" 
                    onChange={(event)=>{setPassword(event.target.value)}}/>
                </div>
                <button type="submit">Login</button>
            </form>

        </div>
    )
}


const Register=()=>{
    const [username,setUsername]=useState<string>('')
    const [password,setPassword]=useState<string>('')
    const handleSubmit=async (event:any)=>{
        event.preventDefault()
        try{
            await axios.post('http://localhost:3001/user/register',{username,password})
            alert('Registration Completed!')
        } catch(err){
            if (axios.isAxiosError(err) && err.response && err?.response?.data?.type===UserErrors.USERNMAE_ALREADY_EXISTS){
                alert('ERROR: Something went wrong')
            }

        }

    }
    return(
        <div className="auth-container" >
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>
                <div className="form-group">
                    <label htmlFor="username">
                        Username:

                    </label>
                    <input type="text" 
                    id="username" 
                    onChange={(event)=>{setUsername(event.target.value)}}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">
                        Password:

                    </label>
                    <input type="password" 
                    id="password" 
                    onChange={(event)=>{setPassword(event.target.value)}}/>
                </div>
                <button type="submit">Regsiter</button>
            </form>

        </div>
    )
}