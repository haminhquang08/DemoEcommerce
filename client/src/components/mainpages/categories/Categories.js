import axios from 'axios'
import React, { useContext, useState } from 'react'
import { GlobalState } from '../../../GlobalState'


function Categories() {
    const state = useContext(GlobalState)
    const [categories] = state.CategoriesAPI.categories
    const [category, setCategory] = useState('')
    const [token] = state.token
    const [callBack, setCallBack] = state.CategoriesAPI.callBack
    const [onEdit, setOnEdit] = useState(false)
    const [id, setID] = useState('')

    const createCategory = async e => {
        e.preventDefault()
        try {
            if (onEdit) {
                const res = await axios.put(`/api/category/${id}`, { name: category }, {
                    headers: { Authorization: token }
                })
                alert(res.data.message)
            } else {
                const res = await axios.post('/api/category', { name: category }, {
                    headers: { Authorization: token }
                })
                alert(res.data.message)
            }
            setOnEdit(false)
            setCategory('')
            setCallBack(!callBack)
        } catch (err) {
            alert(err.response.data.message)
        }
    }

    const editCategory = async (id, name) => {
        setID(id)
        setCategory(name)
        setOnEdit(true)
    }

    const deleteCategory = async id =>{
        try {
            const res = await axios.delete(`/api/category/${id}`, {
                headers: {Authorization: token}
            })
            alert(res.data.message)
            setCallBack(!callBack)    
        } catch (err) {
            alert(err.response.data.message)
        }
    }
    return (
        <div className="categories">
            <form onSubmit={createCategory}>
                <label htmlFor="category">Danh mục</label>
                <input type="text" name="category" value={category} required
                    onChange={e => setCategory(e.target.value)} />

                <button type="submit" className="save-category">{onEdit ? "Update" : "Lưu"}</button>
            </form>

            <div className="col">
                {
                    categories.map(category => (
                        <div className="row" key={category._id}>
                            <p>{category.name}</p>
                            <div className="delete-update-category">
                                <button onClick={() => editCategory(category._id, category.name)}>Chỉnh sửa</button>
                                <button onClick={() => deleteCategory(category._id)}>Xóa danh mục</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Categories
