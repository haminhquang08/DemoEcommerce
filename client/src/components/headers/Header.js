import React, { useContext } from 'react'
import { GlobalState } from '../../GlobalState'
import Menu from './icon/menu.svg'
import Close from './icon/close.svg'
import Cart from './icon/cart.svg'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Header() {
    const state = useContext(GlobalState)
    const [isLogged] = state.UserAPI.isLogged
    const [isAdmin] = state.UserAPI.isAdmin
    const [cart] = state.UserAPI.cart

    const logoutUser = async () => {             // tạo hàm logout để đăng xuất và xóa hết token
        await axios.get('/user/logout')
        localStorage.removeItem('firstLogin')
        window.location.href ="/";
        alert('Đăng xuất thành công!')
    }

    const adminRouter = () => {                  // khi đăng nhập admin sẽ hiện ra thêm CRUD products & category
        return (
            <>
                <li><Link to="/create_product">Tạo sản phẩm</Link></li>
                <li><Link to="/category">Danh mục</Link></li>
            </>
        )
    }

    const loggedRouter = () => {                  // khi đăng nhập user chỉ hiện lịch sử và logout
        return (
            <>
                <li><Link to="/history">Lịch sử</Link></li>
                <li><Link to="/" onClick={logoutUser}>Đăng xuất</Link></li>
            </>
        )
    }

    return (
        <header>
            <div className="menu">
                <img src={Menu} alt="" width="30px" />
            </div>

            <div className="logo">
                <h1>
                    <Link to="/">{isAdmin ? 'Admin' : 'M.Quang Shop'}</Link>
                </h1>
            </div>

            <ul>
                <li><Link to="/">{isAdmin ? 'Products' : 'Shop'}</Link></li>

                {isAdmin && adminRouter()}
                {
                    isLogged ? loggedRouter() : <li><Link to="/login">Đăng nhập * Đăng ký</Link></li>
                }

                <li>
                    <img src={Close} alt="" width="30" className="menu" />
                </li>
            </ul>

             {   // số lượng product trog giỏ hàng
                isAdmin ? '' 
                :<div className="cart-icon">                
                    <span>{cart.length}</span>  
                    <Link to="/cart">
                        <img src={Cart} alt="" width="30" />
                    </Link>
                </div>
            }

        </header>
    )
}

export default Header
