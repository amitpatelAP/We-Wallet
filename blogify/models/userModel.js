const {Schema, model} = require('mongoose');
const{createHmac,randomBytes}=require('crypto');
const { createTokenForUser } = require('../services/authentication');
// const token = require('../services/authentication');
const UserSchema = new Schema({
    fullName:{
        type: String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique :true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profileImageUrl:{
        type:String,
        default:'/images/default.png',
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
    },
},
{timestramps: true});

UserSchema.pre("save", function(next) {
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }

    const salt = randomBytes(16).toString("hex");
    const hashPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest("hex");

    user.salt = salt;
    user.password = hashPassword;
    next();
});

UserSchema.static("matchPasswordAndGenrateToken", async function(email, password){
    const user = await this.findOne({ email });

    if (!user) {
        throw new Error('User not Found...');
    }

    const { salt, password: hashedPassword } = user;

    const userProvidedHash = createHmac('sha256', salt)
        .update(password)
        .digest("hex");

    if (hashedPassword !== userProvidedHash) {
        throw new Error('Invalid Password...');
    }
    const token = createTokenForUser(user);
    return token;
});

const User = model("User",UserSchema);
module.exports=User;