const Payments = require('../models/paymentModel')
const Users = require('../models/userModel')
const Products = require('../models/productModel')

const paymentCtrl = {
    getPayments: async(req, res) =>{
        try {
            const payments = await Payments.find()
            res.json(payments)
        } catch (err) {
            return res.status(500).json({message: err.message})
        }
    },
    createPayment: async(req, res) =>{
        try {
            const user = await Users.findById(req.user.id).select('name email')

            if(!user) return res.status(400).json({message: 'User không tồn tại'})

            const {cart, paymentID, address} = req.body;

            const { _id, name, email} = user;

            const newPayment = new Payments({
                user_id: _id, name, email, cart, paymentID, address
            })

            cart.filter(item =>{
                return sold(item._id, item.quantity, item.sold)
            })

            // lưu đơn hàng thanh toán 
            await newPayment.save()
            res.json({message: "Thanh toán thành công!"})
        } catch (err) {
            return res.status(500).json({message: err.message})
        }
    }
}
const sold = async(id, quantity, oldSold) =>{
    await Products.findByIdAndUpdate({_id: id},{
        sold: quantity + oldSold
    })
}

module.exports = paymentCtrl