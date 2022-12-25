class CustomErrorHandler extends Error{
    
    constructor(status,msg){
        super();
        this.status = status;
        this.message = msg; 
    }

    static alreadyExists(message='Already Exists'){
        return new CustomErrorHandler(409,message);
    }
}

export default CustomErrorHandler;