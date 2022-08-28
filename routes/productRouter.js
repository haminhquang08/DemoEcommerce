const router = require('express').Router()
const productCtrl = require('../controllers/productCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.route('/products')
    .get(productCtrl.getProducts)
    .post(auth, authAdmin,productCtrl.createProducts)

router.route('/products/:id')
    .delete(auth, authAdmin,productCtrl.deleteProducts)
    .put(auth, authAdmin,productCtrl.updateProducts)

module.exports = router