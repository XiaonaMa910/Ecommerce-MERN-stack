import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react'
import { IShopContext, ShopContext } from '../context/shop-context'
import { useCookies } from 'react-cookie'
import { access } from 'fs'

export const Navbar=()=>{
    const {availableMoney}=useContext<IShopContext>(ShopContext)
    //console.log("navbar")
    //const money=fetchAvailableMoney()
    const {setIsAuthenticated}=useContext<IShopContext>(ShopContext)
    const [_,setCookies]=useCookies(['access_token'])
    const logout=()=>{
        setIsAuthenticated(false)
    }
    const {isAuthenticated}=useContext<IShopContext>(ShopContext)

    return(
        <div className='navbar'>
            <div className='navbar-title'>
                <h1>Xiaona Shop</h1>


            </div>
            <div className='navbar-links'>
                {isAuthenticated && (
                <>
                <Link to='/'>Shop</Link>
                <Link to='/purchased-items'>Purchases</Link>
                <Link to='checkout'>
                    <FontAwesomeIcon icon={faShoppingCart} />

                </Link>
                <Link to='/auth' onClick={logout}> Logout</Link>
                <span>${availableMoney}</span>
                </>
                )}

            </div>

        </div>
    )
}