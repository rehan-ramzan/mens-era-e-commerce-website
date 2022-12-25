import { Product} from "../../../models";
const productDetailsController = {

    async index(req,res,next){
        let product, relatedName, relatedProducts;
        try{
            product = await  Product.findById(req.params.id);
            let name = product.name.trim().toLowerCase();
            
            if(name.includes('shirt')){
                relatedName = 'shirt';
            }else if(name.includes('jeans')){
                relatedName = 'jeans';
            }else if(name.includes('shoes')){
                relatedName = 'shoes';
            }else if(name.includes('watch')){
                relatedName = 'watch';
            }else if(name.includes('jacket')){
                relatedName = 'jacket';
            }else if(name.includes('hoody')){
                relatedName = 'hoody';
            }else{
                relatedName = 'shirt';
            }
            relatedProducts = 
            await Product.find({$and: [
            {"name": {"$regex": relatedName, "$options": "i"}},{"name":{"$ne":product.name}} 
            ]}); 
        }catch(error){
            return next(error);
        }
        res.render('description',{product,relatedProducts});
    }
    
}
export default productDetailsController;