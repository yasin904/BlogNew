const Feed = require('../models/feed.model')
const io = require('../socket')

module.exports.createPost = async(req,res)=>{
    try{
        const{title,author,description} = req.body;
        

        const containsFeed = await Feed.findOne({$and : [{title : title},{author : author}]});

        if(containsFeed){
          return  res.status(400).json({
                message : "Book already exists in our system"
            })
        }

        const feed = await Feed.create({
            title,
            author,
            description
        });

        const savedFeed = await feed.save();

        // to show new post has been added for different users
        io.getIO().emit("Feed",{
            action : "Feed",
            post : savedFeed,
            message : "New Post created",
        });
        

       return res.status(200).json({
        message : "Feed saved Successfully",
        feed : savedFeed
       })

        
    }
    catch(err){
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

module.exports.getPost = async(req,res)=>{
    try{

        const feed = await Feed.find();

        return res.status(200).json({
            message : "feed display",
            feed : feed
        })

    }
    catch(err){
        return res.status(500).json({
            message : "Internal Server Error"
        })

    }
}
module.exports.deletePost = async(req,res)=>{
    try{

        const {id} =  req.params;
        console.log(id);

        

        

        const deletedPost = await Feed.findByIdAndDelete(id);
        

        // io.getIO().emit("postDeleted", { postId: deletedPost._id });

        return res.status(200).json({
            message : "post deleted successfully"
        })



    }
    catch(err){
        return res.status(500).json({
            message : "Internal Server Error",
            error : err
        })
    }
}

module.exports.editPost = async(req,res)=>{
    try{

    }
    catch(err){
        
    }
}