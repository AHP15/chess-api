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
        const user = await User.findOne({ email })
          .select("+password")
          .populate('friends', ['email', 'status']);

        if (!user) {
            throw new Error(`user with email ${email} does not exist`);
        }

        const passwordIsValid = user.compatePasswords(password);

        if(!passwordIsValid) {
            throw new Error('Incorrect password');
        }

        user.status = 'online';
        await user.save();
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
        const user = await User.findById(req.userId)
          .populate('friends', ['email', 'status']);
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

        const friendQuery = () => User.findOne({email});
        const userQuery = () => User.findById(req.userId);

        const queries = await Promise.all([friendQuery(), userQuery()]);

        const friend = queries[0];
        const user = queries[1];

        if (!friend) {
            throw new Error(`user with email ${email} does not exist`);
        }

        if(user.friends.some(id => String(id) === String(friend._id))) {
            throw new Error(`user with email ${email} already a friend`);
        }
        user.friends.push(friend._id);
        await user.save();

        res.status(201).send({
            success: true,
            friend: {
                _id: friend._id,
                email: friend.email,
                status: friend.status,
            },
            message: 'Friend added successfully'
        });
    } catch(err) {
        handleError(err, res);
    }
}

export const removeFriend = async (req, res) => {
    try {
        const { id } = req.body;

        const friendQuery = () => User.findById(id);
        const userQuery = () => User.findById(req.userId);

        const queries = await Promise.all([friendQuery(), userQuery()]);

        const friend = queries[0];
        const user = queries[1];

        user.friends = user.friends.filter(id => String(id) !== String(friend._id));
        await user.save();

        res.status(201).send({
            success: true,
            message: 'Friend removed successfully'
        });
    } catch(err) {
        handleError(err, res);
    }
};

export const challenge = async (req, res) => {
    try {
        const { email } = req.sanatizedData;
        const friend = await User.findOne({email});

        if (!friend) {
            throw new Error(`user with email ${email} does not exist`);
        }

        if (friend.status === 'offline') {
            throw new Error(`${friend.username} is offline now, please try later`);
        };

        res.status(200).send({
            success: true,
            message: 'Challenge sent successfully'
        });
    } catch(err) {
      handleError(err, res);
    }
  };