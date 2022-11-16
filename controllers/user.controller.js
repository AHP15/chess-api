import { handleError } from "../utils/errorHandler.js";
import SimpleRateLimit from '../utils/limiteFailSignins.js';
import DB from "../models/index.js";

const User = DB.user;
export const signup = async (req, res) => {
    try{
        const user = await User.create(req.sanatizedData);
        res.status(201).send({
            seccuss: true,
            user,
        });
    } catch(err) {  
        handleError(err, res);
    }
};

export const signin = async (req, res) => {
    const {email, password} = req.sanatizedData;
    try{
        const user = await User.findOne({email}).select("+password");
        
        if(!user) {
            throw new Error(`user with email ${email} does not exist`);
        }

        const passwordIsValid = user.compatePasswords(password);

        if(!passwordIsValid) {
            const clients = SimpleRateLimit.clients;
            const currentUser = clients.get(`${req.ip}_${user.email}`);
            if(!currentUser) {
                new SimpleRateLimit(req.ip, user.email);
            }
            else {
                currentUser.addFailAttempts();
            }
            throw new Error('Incorrect password');
        }

        res.status(200).send({
            seccuss: true,
            user,
        });

    } catch(err) {  
        handleError(err, res);
    }
};