const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl') //import userCtrl
const auth = require('../middleware/auth') // import auth

router.post('/register', userCtrl.register)
router.post('/login', userCtrl.login)
router.get('/logout', userCtrl.logout)
router.get('/refresh_token', userCtrl.refreshToken)
router.get('/infor', auth, userCtrl.getUser)
router.patch('/addcart', auth, userCtrl.addCart)
router.get('/history', auth, userCtrl.history)

router.delete('/deleteUser/:id', userCtrl.deleteUser)
module.exports = router