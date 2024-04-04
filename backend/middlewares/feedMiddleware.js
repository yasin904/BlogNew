const validateFeed = (req,res,next)=>{
    if(!req.body.title || !req.body.author || !req.body.description){
        res.status(401).json({
            message : "all fields are required"
        });
        
    }
    

    next();
}
module.exports = validateFeed;