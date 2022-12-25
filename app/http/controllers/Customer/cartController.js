const cartController = {

    index(req,res){
        res.render('cart');
    },

    update(req,res){
        if(!req.session.cart){
            req.session.cart = {
                items:{},
                totalQty:0,
                totalPrice:0
            }
        }
        let cart = req.session.cart;
        if(!cart.items[req.body._id]){
            cart.items[req.body._id] = {item: req.body, qty: 1};
        }else{
            cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
        }
        cart.totalQty += 1;
        cart.totalPrice += req.body.price;
        return res.json({totalQty: cart.totalQty});
    },

    removeCartItem(req,res,next){
        const pid = req.params.id;
        if((Object.keys(req.session.cart.items).length)==1){
            delete(req.session.cart);
        }else{
            let productQuantity = req.session.cart.items[pid].qty
            req.session.cart.totalQty-=  productQuantity;
            req.session.cart.totalPrice -= req.session.cart.items[pid].item.price*productQuantity;
            delete(req.session.cart.items[pid]);
        }
        res.json({'message':'cart updated successfully'})
    }
    
}
export default cartController;