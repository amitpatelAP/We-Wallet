const { Router } = require('express');
const User = require('../models/userModel');
const router = Router();


router.get('/signin', (req, res) => {
    res.render("signin");
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenrateToken(email, password);
        return res.cookie("token",token).redirect('/');
    } catch (error) {
        return res.render("Signin",{
            error:"Incorrect Email or Password"
        });
        
    }
   
});
router.route('/signup')
    .get((req, res) => {
        res.render("signup");
    })
    .post(async (req, res) => {
        const { fullName, email, password } = req.body;
        await User.create({ fullName, email, password });
        return res.redirect("/user/signin");
    });

router.get('/logout',(req,res)=>{
    res.clearCookie("token").redirect('/');
})

module.exports = router;
