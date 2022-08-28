import React, { useContext , useState, useEffect} from 'react'
import { GlobalState } from '../../../GlobalState'  
import axios from 'axios'
import PaypalButton from './PaypalButton'

function Cart() {
    const state = useContext(GlobalState)
    const [cart, setCart] = state.UserAPI.cart
    const [total, setTotal] = useState(0)
    const [token, setToken] = state.token


    useEffect(()=>{
        const getTotal = () =>{
            const total = cart.reduce((prev,item) =>{
                return prev + (item.price * item.quantity) // lấy giá của sản phẩm * số lượng + (sản phẩm khác)
            },0)
            setTotal(total)
        }
        getTotal()
    },[cart])

    const addToCart = async (cart) =>{
        await axios.patch('/user/addcart', {cart}, {
            headers: {Authorization: token}
        })
    }

    const increment = (id) =>{
        cart.forEach(item =>{
            if(item._id ===id){
                item.quantity += 1
            }
        })
        setCart([...cart])
        addToCart(cart)
    }

    const prison = (id) =>{
        cart.forEach(item =>{
            if(item._id === id){
                item.quantity === 1 ? item.quantity = 1 : item.quantity -= 1
            }
        })
        setCart([...cart])
        addToCart(cart)
    }

    const removeProduct = id =>{
        if(window.confirm("Bạn muốn xóa sản phẩm?")){
            cart.forEach((item, index)=>{
                if(item._id === id){
                    cart.splice(index, 1)
                }
            })
            setCart([...cart])
            addToCart(cart)
        }
    }

    const tranSuccess = async(payment) =>{
        
        const {paymentID, address} = payment

        await axios.post('/api/payment', {cart, paymentID, address}, {
            headers: {Authorization: token}
        })

        setCart([])
        addToCart([])
        alert('Thanh toán đơn hàng thành công!')
    }
    if (cart.length === 0) // nếu giỏ hàng = 0 ==> giỏ hàng trống
        return <h2 style={{ textAlign: "center", fontSize: "4.5rem" }}>Giỏ hàng của bạn đang trống</h2>

    return (
        <div>
            {
                cart.map(product => (
                    <div className="detail cart" key={product._id}>
                        <img src={product.images.url} alt="" />

                        <div className="box-detail">
                            <h2>{product.title}</h2>

                            <h4>{product.price * product.quantity}$</h4>
                            <p>{product.description}</p>
                            <p>{product.content}</p>
                            
                            <div className="amount">
                                <button onClick={() => prison(product._id)}> - </button>
                                <span>{product.quantity}</span>
                                <button onClick={() => increment(product._id)}> + </button>
                            </div>
                            
                            <div className="delete" onClick={() => removeProduct(product._id)}>
                                X
                            </div>
                        </div>
                    </div>
                ))
            }

            <div className="total">
                <h4>Tổng tiền: {total} $</h4>
                <PaypalButton 
                total={total}
                tranSuccess={tranSuccess}/>
            </div>
        </div>
    )
}

export default Cart
