import React, { useContext, useState, useEffect } from 'react'
import { GlobalState } from '../../../GlobalState'
import axios from 'axios'
import Loading from '../utils/loading/Loading'
import { useNavigate, useParams } from 'react-router-dom'

const initialState = {
    product_id: '',
    title: '',
    price: 0,
    description: '',
    content: '',
    category: '',
    _id: ''
}

function CreateProduct() {
    const state = useContext(GlobalState)
    const [product, setProduct] = useState(initialState)
    const [categories] = state.CategoriesAPI.categories
    const [images, setImages] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isAdmin] = state.UserAPI.isAdmin
    const [token] = state.token
    const [products, setProducts] = state.ProductsAPI.products
    const [onEdit, setOnEdit] = useState(false)
    const [callBack, setCallBack] = state.ProductsAPI.callBack


    const styleUpload = {
        display: images ? "block" : "none"
    }

    const handleUpload = async e => {
        e.preventDefault()
        try {
            if (!isAdmin) return alert("Bạn không phải ADMIN")
            const file = e.target.files[0]

            if (!file) return alert("Ảnh không tồn tại!")

            if (file.size > 1024 * 1024) // 1mb
                return alert("Size ảnh quá lớn!")

            if (file.type !== 'image/jpeg' && file.type !== 'image/png') // 1mb
                return alert("Định dạng ảnh không hợp lệ")

            let formData = new FormData()
            formData.append('file', file)

            setLoading(true)
            const res = await axios.post('/api/upload', formData, {
                headers: { 'content-type': 'multipart/form-data', Authorization: token }
            })
            setLoading(false)
            setImages(res.data)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleDestroy = async () => {
        try {
            if (!isAdmin) return alert("Bạn không phải ADMIN")
            setLoading(true)
            await axios.post('/api/destroy', { public_id: images.public_id }, {
                headers: { Authorization: token }
            })
            setLoading(false)
            setImages(false)
        } catch (err) {
            alert(err.response.data.message)
        }
    }

    const handleChangeInput = e => {
        const { name, value } = e.target
        setProduct({ ...product, [name]: value })
    }
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if (params.id) {
            setOnEdit(true)
            products.forEach(product => {
                if (product._id === params.id) {
                    setProduct(product)
                    setImages(product.images)
                }
            })
        } else {
            setOnEdit(false)
            setProduct(initialState)
            setImages(false)
        }
    }, [params.id, products])

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            if (!isAdmin) return alert("Bạn không phải ADMIN")
            if (!images) return alert("Không có hình ảnh Upload")

            if (onEdit) {
                await axios.put(`/api/products/${product._id}`, { ...product, images }, {
                    headers: { Authorization: token }
                })
                alert('Cập nhật sản phẩm thành công!')
            } else {
                await axios.post('/api/products', { ...product, images }, {
                    headers: { Authorization: token }
                })
                alert('Tạo sản phẩm thành công!')
            }
            
            setCallBack(!callBack)
            navigate.push("/")
        } catch (err) {
            alert(err.response.data.message)
        }
    }

    return (
        <div className="create_product">
            <div className="upload">
                <input type="file" name="file" id="file_up" onChange={handleUpload} />
                {
                    loading ? <div id="file_img"> <Loading /> </div>
                        : <div id="file_img" style={styleUpload}>
                            <img src={images ? images.url : ''} alt="" />
                            <span onClick={handleDestroy}>X</span>
                        </div>
                }

            </div>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <label htmlFor="product_id">ID Sản phẩm</label>
                    <input type="text" name="product_id" id="product_id" required
                        value={product.product_id} onChange={handleChangeInput} disabled={onEdit} />
                </div>

                <div className="row">
                    <label htmlFor="title">Tên Sản phẩm</label>
                    <input type="text" name="title" id="title" required
                        value={product.title} onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="price">Giá</label>
                    <input type="number" name="price" id="price" required
                        value={product.price} onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="description">Mô tả</label>
                    <textarea type="text" name="description" id="description" required
                        value={product.description} rows="5" onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="content">Nội dung</label>
                    <textarea type="text" name="content" id="content" required
                        value={product.content} rows="7" onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="categories">Danh mục: </label>
                    <select name="category" value={product.category} onChange={handleChangeInput}>
                        <option value=""> Hãy lựa chọn danh mục</option>
                        {
                            categories.map(category => (
                                <option value={category._id} key={category._id}>
                                    {category.name}
                                </option>
                            ))
                        }
                    </select>
                </div>

                <button type="submit">{onEdit ? "Cập nhật" : "Tạo"}</button>
            </form>
        </div>
    )
}

export default CreateProduct