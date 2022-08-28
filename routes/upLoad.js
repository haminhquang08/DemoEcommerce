const router = require('express').Router()
const cloudinary = require('cloudinary')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const fs = require('fs')

// upload hình ảnh với cloudinary chỉ có Admin mới được thục hiện
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

//Upload Image chỉ đc admin dùng
router.post('/upload',auth, authAdmin, (req, res) => {
    try {
        console.log(req.files);
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ message: 'Không có tệp nào được tải lên' })

        const file = req.files.file;
        // check kích thước ảnh ko được quá lớn 5mb
        if (file.size > 1024 * 1024) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ message: 'Size ảnh quá lớn' })
        }


        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ message: 'Định dạng tệp không chính xác' })
        }


        cloudinary.v2.uploader.upload(file.tempFilePath, { folder: "test" }, async (err, result) => {
            if (err) throw err;

            removeTmp(file.tempFilePath)

            res.json({ public_id: result.public_id, url: result.secure_url })
        })

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

// Delete Image chỉ đc admin dùng
router.post('/destroy', auth, authAdmin,(req, res) => {
    try {
        const { public_id } = req.body
        if (!public_id) return res.status(400).json({ message: 'Không tìm thấy ảnh' })

        cloudinary.v2.uploader.destroy(public_id, async(err, result) =>{
            if(err) throw err;

            res.json({message:'Xóa hình ảnh thành công!'})
        })
    } catch (error) {
        return res.status(500).json({ message: err.message })
    }

})
const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    })
}

module.exports = router