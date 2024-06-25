const mongoose = require('mongoose')

const FeedSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    author : {
        type : String,
        required : true

    },
    description : {
        type : String,
        required : true
    },
    img : {
        type : String,
        default : "https://picsum.photos/id/1/200/300"
    },
    editCount : {
        type : Number,
        default : 0
    }

},
{
    timestamps : true
})

const Feed = mongoose.model("Feed",FeedSchema);

module.exports = Feed
