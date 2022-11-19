import { handleError } from "../utils/errorHandler.js";
import sendToken from "../utils/jwt.js";
import DB from "../models/index.js";

const User = DB.user;
export const signup = async (req, res) => {
    try{
        const user = await User.create(req.sanatizedData);
        sendToken(user, 201, res);
    } catch(err) {  
        handleError(err, res);
    }
};


export const signin = async (req, res) => {
    const {email, password} = req.sanatizedData;
    try{
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            throw new Error(`user with email ${email} does not exist`);
        }

        const passwordIsValid = user.compatePasswords(password);

        if(!passwordIsValid) {
            throw new Error('Incorrect password');
        }

        sendToken(user, 200, res);
    } catch(err) {  
        handleError(err, res);
    }
};