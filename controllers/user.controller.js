import { handleError } from "../utils/errorHandler.js";
import sendToken from "../utils/jwt.js";
import DB from "../models/index.js";
import bcrypt from "bcryptjs";

const User = DB.user;
export const signup = async (req, res) => {
    try{
        req.sanatizedData.password = bcrypt.hashSync(req.sanatizedData.password, 10);
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

export const signout = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        user.status = 'offline';
        res.status(200).send({
            success: true,
            message: 'SignOut successfully'
        });
        await user.save();
    } catch(err) {
        handleError(err, res);
    }
};

export const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        res.status(200).send({
            success: true,
            user,
        });
    } catch(err) {
        handleError(err, res);
    }
}

export const addFriend = async (req, res) => {
    try {
        const { email } = req.sanatizedData;

        const friendQuery = () => User.findOne({email: email});
        const userQuery = () => User.findById(req.userId);

        const queries = await Promise.all([friendQuery, userQuery]);

        const friend = queries[0].value;
        const user = queries[1].value;

        if (!friend) {
            throw new Error(`user with email ${email} does not exist`);
        }

        user.friends.push(friend._id);
        await user.save();

        res.status(201).send({
            success: true,
            message: 'friend added successfully'
        });
    } catch(err) {
        handleError(err, res);
    }
}

export const removeFriend = async (req, res) => {
    try {
        const { email } = res.body;

        const friendQuery = () => User.findOne({email: email});
        const userQuery = () => User.findById(req.userId);

        const queries = await Promise.all([friendQuery, userQuery]);

        const friend = queries[0].value;
        const user = queries[1].value;

        user.friends = user.friends.filter(id => id !== friend._id);
        await user.save();

        res.status(201).send({
            success: true,
            message: 'friend added successfully'
        });
    } catch(err) {
        handleError(err, res);
    }
};