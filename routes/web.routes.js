import { authController, homeController, 
         productDetailsController, cartController, 
         productController, orderController } from '../app/http/controllers';
import { guest, authorize, multiFormData, admin } from '../app/http/middlewares';

const initRoutes = (app)=>{

    app.get('/login', guest,authController.login);    
    app.post('/login', authController.postLogin)
    app.get('/register',guest,authController.register);
    app.post('/register',authController.postRegister);
    app.get('/logout',authController.logout);
    app.get('/', homeController.index);
    app.get('/product/details/:id', productDetailsController.index);
    app.get('/cart',cartController.index)
    app.post('/cart',cartController.update);
    app.put('/cart/:id',cartController.removeCartItem)
    app.get('/product',productController.index)
    app.post('/product',multiFormData, productController.store);    
    app.delete('/product/:id',productController.destroy);
    app.put('/product/:id',multiFormData ,productController.update);   
    app.get('/account', authorize , authController.account)
    app.put('/account/:id', authController.updateAccount)
    app.get('/order', [authorize,admin],orderController.index)
    app.delete('/order/:id',orderController.destroy);
    app.post('/create-checkout-session',orderController.placeOrders)
    

    app.get('/contact',homeController.contactIndex);
    app.post('/contact',homeController.message);
    
    app.get('/forget-password', (req,res)=>{ res.render('forget-password') })
    app.post('/forget-password', authController.forgetPassword);

    app.get('/reset-password/:id/:token', authController.getResetPassword);
    app.put('/reset-password/:id/:token', authController.setResetPassword);

}

export default initRoutes;