const Products = require('../models/productModel')

// Tìm kiếm, xắp sếp và phân trang
class APIfeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }
    filtering() {
        const queryObj = { ...this.queryString } //queryString = req.query

        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach(el => delete (queryObj[el]))

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)
        console.log({ queryStr });

        //    gte = lớn hơn hoặc bằng
        //    lte = nhỏ hơn hoặc bằng
        //    lt = nhỏ hơn
        //    gt = lớn hơn
        this.query.find(JSON.parse(queryStr))

        return this;
    }
    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('-createAt')
        }
        return this;
    }
    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}
const productCtrl = {
    getProducts: async (req, res) => {
        try {
            const features = new APIfeatures(Products.find(), req.query)
            .filtering().sorting()

            const products = await features.query

            res.json({
                status: 'success',
                result: products.length,
                products: products
            })
            res.json(products)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createProducts: async (req, res) => {
        try {
            const { product_id, title, price, description, content, images, category } = req.body
            // check image đã được chọn để uploa lên chưa
            if (!images)
                return res.status(400).json({ messsage: 'Không có ảnh nào được tải lên' })

            // check product đã tồn tại hay chưa    
            const product = await Products.findOne({ product_id })
            if (product)
                return res.status(400).json({ messsage: 'Sản phẩm đã tồn tại' })
            // tạo product mới
            const newProduct = new Products({
                product_id, title: title.toLowerCase(), price, description, content, images, category
            })
            // save vào mongoDB
            await newProduct.save()
            res.json({ messsage: 'Thêm sản phẩm thành công!' })

        } catch (err) {
            return res.status(500).json({ messsage: err.messsage })
        }
    },
    deleteProducts: async (req, res) => {
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json({ message: 'Xóa sản phẩm thành công' })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    },
    updateProducts: async (req, res) => {
        try {
            const { title, price, description, content, images, category } = req.body
            if (!images) return res.status(500).json({ message: 'Không có ảnh nào được tải lên' })

            await Products.findOneAndUpdate({ _id: req.params.id }, {
                title: title.toLowerCase(), price, description, content, images, category
            })

            res.json({ message: 'Update sản phẩm thành công' })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }
}

module.exports = productCtrl