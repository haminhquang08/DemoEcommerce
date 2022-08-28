import React, { useContext } from 'react'
import { GlobalState } from '../../../GlobalState'

function Filter() {
    const state = useContext(GlobalState)
    const [categories, setCategories] = state.CategoriesAPI.categories
    const [category, setCategory] = state.ProductsAPI.category
    const [sort, setSort] = state.ProductsAPI.sort
    const [search, setSearch] = state.ProductsAPI.search

    const handleCategory = e => {
        setCategory(e.target.value)
        setSearch('')
    }
    return (
        <div className="filter_menu">
            <div className="row">
                <span>Search: </span>
                <select name="category" value={category} onChange={handleCategory} >
                    <option value=''>All Product</option>
                    {
                        categories.map(category => (
                            <option value={"category=" + category._id} key={category._id}>
                                {category.name}
                            </option>
                        ))
                    }
                </select>
            </div>

            <input type="text" value={search} placeholder="Bạn muốn tìm gì?"
                onChange={e => setSearch(e.target.value.toLowerCase())} />

            <div className="row">
                <span>Lọc: </span>
                <select value={sort} onChange={e => setSort(e.target.value)} >
                    <option value=''>Sản phẩm mới nhất</option>
                    <option value='sort=oldest'>Sản phẩm cũ nhất</option>
                    <option value='sort=-sold'>Bán chạy nhất</option>
                    <option value='sort=-price'>Giá: Cao - Thấp</option>
                    <option value='sort=price'>Giá: Thấp - Cao</option>
                </select>
            </div>
        </div>
    )
}

export default Filter
