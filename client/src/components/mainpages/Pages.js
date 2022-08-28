import React, {useContext} from 'react'
import { Routes ,Route } from 'react-router-dom'; // Ở react-router-dom 'Switch' sẽ thay thế bởi 'Routes'
import Products from './products/Products'
import DetailProduct from './detailProduct/DetailProduct';
import Login from './auth/Login'
import Register from './auth/Register'
import OrderHistory from './history/OrderHistory'
import OrderDetail from './history/OrderDetail'
import Cart from './cart/Cart'
import Categories from './categories/Categories';
import CreateProduct from './createProduct/CreateProduct';
import NotFound from './utils/NotFound/NotFound'

import { GlobalState } from '../../GlobalState';

function Pages() {
    const state = useContext(GlobalState)
    const [isLogged] = state.UserAPI.isLogged
    const [isAdmin] = state.UserAPI.isAdmin

    return (
        <Routes>
            <Route path="/"  element={<Products />} />
            <Route path="/detail/:id"  element={<DetailProduct />} />
            
            <Route path="/login"  element={isLogged ? NotFound:< Login />} />
            <Route path="/register"  element={isLogged ? NotFound :<Register />} />
            <Route path="/history"  element={isLogged ? <OrderHistory /> : NotFound} />
            <Route path="/history/:id"  element={isLogged ? <OrderDetail /> : NotFound} />
            <Route path="/cart"  element={<Cart />} />

            <Route path="/category"  element={isAdmin ? <Categories /> : NotFound} />
            <Route path="/create_product"  element={isAdmin ? <CreateProduct /> : NotFound} />
            <Route path="/edit_product/:id"  element={isAdmin ? <CreateProduct /> : NotFound} />

            <Route path="*"  element={<NotFound />} />
        </Routes>
    )
}

export default Pages
