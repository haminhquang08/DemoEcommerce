import {useState, useEffect} from 'react'
import axios from 'axios'

function ProductsAPI() {
    // tạo useState Products
    const [products, setProducts] = useState([])
    const [callBack, setCallBack] = useState(false)
    const [category, setCategory] = useState('')
    const [sort, setSort] = useState('')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [result, setResult] = useState(0)

    // api Product
    useEffect(() =>{
        const getProducts = async () =>{
            const res = await axios.get(`/api/products?limit=${page*9}&${category}&${sort}&title[regex]=${search}`)
            setProducts(res.data.products)
            setResult(res.data.result)
        }
        getProducts()
    },[callBack, category, sort, search, page])

    return {
        products: [products, setProducts],
        callBack: [callBack, setCallBack],
        category: [category, setCategory],
        sort: [sort, setSort],
        search: [search, setSearch],
        page: [page, setPage],
        result: [result, setResult]
    }
}

export default ProductsAPI
