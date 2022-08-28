import React, { useContext, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import ProductItem from '../utils/ProductItem/ProductItem'

function DetailProduct() {
    const params = useParams() // lấy id chi tiết sản phẩm 
    const state = useContext(GlobalState)
    const [products] = state.ProductsAPI.products // lấy bên api
    const [detailProduct, setDetailProduct] = useState([])
    const addCart = state.UserAPI.addCart

    useEffect(() => {
        if(params.id) {
            products.forEach(product => {
                if (product._id === params.id) setDetailProduct(product)
            });
        }
    }, [params.id, products])

    if (detailProduct.length === 0) return null;
    // console.log(detailProduct);

    return (
        <>
            <div className="detail">
                <img src={detailProduct.images.url} alt="" />
                <div className="box-detail">
                    <div className="row">
                        <h2>{detailProduct.title}</h2>
                        <h6>ID: {detailProduct.product_id}</h6>
                    </div>
                    <span>{detailProduct.price}$</span>
                    <p>{detailProduct.description}</p>
                    <p>{detailProduct.content}</p>
                    <p>Sold: {detailProduct.sold}</p>
                    <Link to="/cart" className="cart" onClick={() => addCart(detailProduct)}> 
                        Mua Ngay 
                    </Link>
                </div>
            </div>

            <div>
                <h2>Sản phẩm có liên quan</h2>
                <div className="products">
                    {
                        products.map(product => {
                            return product.category === detailProduct.category
                                ? <ProductItem key={product._id} product={product} /> : null
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default DetailProduct
