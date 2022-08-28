import React, { useContext , useState} from 'react'
import { GlobalState } from '../../../GlobalState'
import ProductItem from '../utils/ProductItem/ProductItem'
import Loading from '../utils/loading/Loading'
import axios from 'axios'
import Filter from './Filter'

function Products() {
    const state = useContext(GlobalState)
    const [products, setProducts] = state.ProductsAPI.products
    const [isAdmin] = state.UserAPI.isAdmin
    const [token] = state.token
    const [callBack, setCallBack] = state.ProductsAPI.callBack
    const [loading, setLoading] = useState(false)
    const [isCheck, setIsCheck] = useState(false)

    const handleCheck = (id) => {
        products.forEach(product =>{
            if(product._id === id) product.checked = !product.checked
        })
        setProducts([...products])
    }

    const deleteProduct = async (id, public_id) => {
        console.log({id, public_id});
        try {
            setLoading(true)
            const destroyImg = axios.post('/api/destroy', { public_id}, {
                headers: { Authorization: token }
            })
            const deleteProduct = axios.delete(`/api/products/${id}`, {
                headers: { Authorization: token }
            })

            await destroyImg
            await deleteProduct
            setCallBack(!callBack)
            setLoading(false)
            alert('Xóa sản phẩm thành công!')
        } catch (err) {
            alert(err.response.data.message)
        }
    }

    const checkAll = () =>{
        products.forEach(product =>{
            product.checked = !isCheck
        })
        setProducts([...products])
        setIsCheck(!isCheck)
    }

    const deleteAll = () =>{
        products.forEach(product =>{
            if(product.checked) deleteProduct(product._id, product.images.public_id)
        })
    }


    if(loading) return <div><Loading /></div>
    return (
        <>
        <Filter />
        {
            isAdmin && 
            <div className="delete-all">
                <span>Chọn tất cả</span>
                <input type="checkbox" checked={isCheck} onChange={checkAll}/>
                <button onClick={deleteAll}>Xóa tất cả</button>
            </div>
        }
            <div className="products">
                {
                    products.map(product => {
                        return <ProductItem key={product._id} product={product}
                        isAdmin={isAdmin} deleteProduct={deleteProduct} handleCheck={handleCheck}/>
                    })
                }
            </div>
            {products.length === 0 && <Loading />}
        </>
    )
}

export default Products
