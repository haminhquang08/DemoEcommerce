const Users = require('../models/userModel')

const authAdmin = async (req, res, next) =>{
    try {
        // Get thông tin bằng ID
        const user = await Users.findOne({
            _id: req.user.id
        })
        if(user.role === 0) 
        return res.status(400).json({message: 'Quyền truy cập bị tự chối'})
        next()
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
}

module.exports = authAdmin