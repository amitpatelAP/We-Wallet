const {Schema, model} = require('mongoose');
const CommentSchema = new Schema({
    content:{
    type:String,
    required:true,}
    , createdAt: {
         type: Date, 
         default: Date.now },
    blogId:{
        type:Schema.Types.ObjectId,
        ref:"blog"
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
},{timestamps: true});
const Comment = model('Comment', CommentSchema);
module.exports=Comment;