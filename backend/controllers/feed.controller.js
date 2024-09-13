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

        console.log(feed)
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
            message : "Internal Server Error",
            error : err
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

        

        

         await Feed.findByIdAndDelete(id);
        

        // io.getIO().emit("postDeleted", { postId: deletedPost._id });

        return res.status(200).json({
            message : "post deleted successfully",
            
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

        
        const {id} = req.params;



        const updatedFields = {};

        const {title,author,description} = req.body;

        const post = await Feed.findById(id);

        if(!post){
            return res.status(404).json({
                message : "no post found"
            })
        }

        const ninetyDaysAgo = new Date()
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        if(post.lastEditDate<ninetyDaysAgo){
            post.editCount = 0;

        }
        if(post.editCount >=3){
            return res.status(403).json({
                message : "post cannot be updated more than 3 times"
            });
        }



        if(title) updatedFields.title = title;
        if(author) updatedFields.author = author;
        if(description) updatedFields.description = description;

        updatedFields.editCount = post.editCount + 1;

        const updatedPost = await Feed.findByIdAndUpdate(id,updatedFields,{new : true});

    

        

        io.getIO().emit('editedPost',{postId : updatedPost._id});



        return res.status(200).json({
            message : "post updated successfully",
            post : updatedPost

        })



    }
    catch(err){
        console.error('Error updating post:', err);
        return res.status(500).json({
            message : "Internal server Error",
            error : err
        })
    }
}

module.exports.viewPost = async(req,res)=>{
    try{

        const{id} = req.params;

        const post = await Feed.findById(id);

        if(!post){
            return res.status(400).json({
                message : "post does not exist"
            })
        }

        return res.status(200).json({
            message : "view post",
            post : post
        })
    }
    catch(err){
        console.error('Error viewing post: ',err);
        return res.status(500).json({
            message : "Internal server error",
            error : err
        })
    }
}
module.exports.searchResult = async(req,res)=>{
    try{
        let query = req.query['q'];

        query = query.trim();

        if (!query) {
            return res.status(400).json({ message: "Please type a search query" });
        }

        console.log(query)
        

        // if (!query || typeof query !== 'string') {
        //     return res.status(400).json({
        //         message: "Invalid query parameter"
        //     });
        // }

        // if (typeof query !== 'string') {
        //     query = String(query);
        //     console.log(query);
        // }
        

        

            
            const posts = await Feed.find({
                $or:[
                    {title : {$regex : query,$options : 'i'}},
                    {author : {$regex : query,$options : 'i'}}


                ]
            });

            

            if (posts.length === 0) {
                return res.status(401).json({
                    message: "No match found"
                });
            }
    
            return res.status(200).json({
                message: "Matches found",
                data: posts
            });

        }

    
    catch(err){
        console.log(err);
        return res.status(500).json({
            message : "Internal server error",
            error : err
        })
    }
}