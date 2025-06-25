import { instance } from "../server";

export const checkout = async(req, res) => {
    const options = {
        amount: 5000,
        currency: "INR",
       // receipt: "receipt#1",
    };
    const order = await instance.orders.create(options);
    console.log(order);
    res.status(200).json({
        sucsess:true,
    });
    

};