import mongoose from 'mongoose';
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const { model, Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type:String,
        required: [true, "username is required!!"],
        maxlength:[30, "name can not exceed 30 charcters!!"],
        minlength:[4, "name must have at leat 4 characters!!"],
    },
    email:{
        type: String,
        required: [true, "email is required!!"],
        validate:[validator.isEmail, "Please enter a valid email!!"],
        unique: true
    },
    password:{
        type:String,
        required:[true, "password is required!!"],
        minlength: [8, "name must have at leat 8 characters!!"],
        select: false,
    },
    status:{
        type: String,
        default:"online"
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    games: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Game"
    }],
});


userSchema.methods.compatePasswords = function(clientPassword){
    return bcrypt.compareSync(clientPassword, this.password);
}

userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: parseFloat(process.env.JWT_EXPIRE)
    });
};

export default model("User", userSchema);