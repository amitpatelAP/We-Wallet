const { Router } = require('express');
const router = Router();
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blogModal')
const Comment = require("../models/commentModel");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
     const filename = `${Date.now()}-${file.originalname}`
     cb(null, filename);
    }
});

const upload = multer({ storage: storage })

router.get('/add-new',(req,res)=>{
    res.render('addBlog',{user:req.user});
})
router.post('/', upload.single('coverImage') ,async (req, res) => {
    const{blogbody} = req.body;
    const blog = await Blog.create({
        title: req.body.title,
        body: blogbody,
        createdBy: req.user.__id,
        coverImageURL: req.file ? `/uploads/${req.file.filename}` : undefined
    });
    return res.redirect(`/blog/${blog._id}`);
});
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('createdBy');
        if (!blog) return res.status(404).send("Blog not found");
        const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy');
        return res.render('blog', {
            blog,
            user: req.user,
            comments
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Something went wrong");
    }
});
router.post('/comment/:blogId',async (req,res)=>{
    const  comment  = await Comment.create({
        content:req.body.comment,
        blogId:req.params.blogId,
        createdBy:req.user.__id
    });
    return res.redirect(`/blog/${req.params.blogId}`)
});

module.exports = router;