import dotenv from 'dotenv';
dotenv.config();
import Joi from 'joi';
import { Order } from "../../models";
const stripe = require('stripe')(process.env.STRIPE_KEY);

const orderController = {
    async index(req,res){
        let orders;
        try{
           orders =  await Order.find();
        }catch(error){
            return next(error);
        }    
        res.render('order',{orders});
    },

    async placeOrders(req,res,next){
        const {address, phone, pay_method} = req.body;
        const orderSchema = Joi.object({
            address: Joi.string().min(5).max(50).required(),
            phone: Joi.string().length(11).pattern(/^[0-9]+$/).required()
        })
        const {error} = orderSchema.validate({address,phone});
        if(error){
            return res.status(422).json({message : error.message});
        } 
        try{
            const order= await Order.create({items:req.session.cart, address, phone, 
              email:req.user.email});
            if(pay_method==='Card'){
              const line_items = (Object.values(req.session.cart.items)).map( product =>{
                return {
                  price_data: {
                  currency: 'usd',
                  product_data: {
                  name: product.item.name,
                  metadata: {
                      id: product.item._id
                  }
                      },
                  unit_amount: 
                  ( product.item.price - ((product.item.price*product.item.off)/100) )*100,
                  },
                  quantity: product.qty,
                } 
              })
              const session = await stripe.checkout.sessions.create({
                shipping_options: [
                {
                  shipping_rate_data: {
                    type: "fixed_amount",
                    fixed_amount: {
                      amount: 0,
                      currency: "usd",
                    },
                    display_name: "Free shipping",
                    // Delivers between 5-7 business days
                    delivery_estimate: {
                      minimum: {
                        unit: "business_day",
                        value: 5,
                      },
                      maximum: {
                        unit: "business_day",
                        value: 7,
                      },
                    },
                  },
                },
                {
                  shipping_rate_data: {
                    type: "fixed_amount",
                    fixed_amount: {
                      amount: 1500,
                      currency: "usd",
                    },
                    display_name: "Next day air",
                    // Delivers in exactly 1 business day
                    delivery_estimate: {
                      minimum: {
                        unit: "business_day",
                        value: 1,
                      },
                      maximum: {
                        unit: "business_day",
                        value: 1,
                      },
                    },
                  },
                },
              ],
                phone_number_collection: {
                    enabled: true,
                },
                line_items,
                mode: 'payment',
                success_url: 'http://localhost:5000',
                cancel_url: 'http://localhost:5000/cart',
              });
              await Order.findByIdAndUpdate(order._id,{paymentStatus:true})
              delete(req.session.cart);
              return res.send({ url: session.url});
            }else{
              delete(req.session.cart);
              return res.json({message:'payment successfull'});
          }
      }catch(error){
        return next(error);
      }
    },

    async destroy(req,res,next){
      try{
        await Order.findOneAndDelete({_id:req.params.id});
        res.json({message:'deleted successfully'});
      }catch(error){
        return next(error);
      }
    }
}
export default orderController;