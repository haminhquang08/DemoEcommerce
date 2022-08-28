import React, {useContext}from 'react'
import { Link } from 'react-router-dom'
import { GlobalState } from '../../../../GlobalState'

function BtnRender({ product ,deleteProduct}) {
    const state = useContext(GlobalState)
    const [isAdmin] = state.UserAPI.isAdmin
    const addCart = state.UserAPI.addCart

    return (
        <div className="row_btn">
            {
                isAdmin ?
                    <>
                        <Link id="btn_buy" to="#!" onClick={() => deleteProduct(product._id, product.images.public_id)}>
                            Xóa
                        </Link>

                        <Link id="buy_view" to={`/edit_product/${product._id}`}>
                            Cập nhật
                        </Link>
                    </>
                    :
                    <>
                        <Link id="btn_buy" to="#!" onClick={() => addCart(product)}>
                            Mua
                        </Link>

                        <Link id="buy_view" to={`/detail/${product._id}`}>
                            Xem
                        </Link>
                    </>
            }
        </div>
    )
}

export default BtnRender
