import multer from 'multer';
import path from 'path';
const folderPath = path.join(path.resolve(),'/public/assests/Products');

const storage = multer.diskStorage({
    destination: (req,file,cb)=> cb(null,folderPath),
    filename: (req,file,cb)=>{
        const uniqueFileName = `${ Date.now() }-${ Math.round(Math.random() * 1E9) }${ path.extname(file.originalname) }`;
        cb(null, uniqueFileName);
    }
});

const upload = multer({storage:storage, limits:{fileSize: 1000000*2}}).array('image', 4);

const multiFormData = (req,res,next)=>{    
    upload(req,res,(error)=>{
        if(error){
            return next(error);
        }
        next();
    })
}
export default multiFormData; 