import express from 'express';

const router = express.Router();
const {createOrder}=require('../controllers/razorpay');

//router.route("/checkout").post(checkout);
router.post('/create-order', createOrder);


module.exports=router;