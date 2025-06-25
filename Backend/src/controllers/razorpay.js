const Razorpay = require('razorpay');
const razorpay=new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
exports.createOrder = async (req, res) => {
    const {amount,currency='INR'}=req.body;
    try{
        const options = {
            amount: amount * 100,  // Convert to paise
            currency: currency,
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1, // Auto capture
        };
        const order=await razorpayInstance.orders.create(options);
        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
module.exports = {
    createOrder,
};