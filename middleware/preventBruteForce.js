import SimpleRateLimit from '../utils/limiteFailSignins.js';
import { handleError } from '../utils/errorHandler.js';

export const isUserblocked = (req, res, next) => {
    const clients = SimpleRateLimit.clients;
    const key = `${req.ip}_${req.sanatizedData.email}`;
    const currentClient = clients.get(key);

    if(!currentClient || !currentClient.isBlocked()) {
        return next();
    }

    if(currentClient.isBlocked()) {
        return handleError(
            new Error('Maximum attempts exeeded! please try after 24 hours'),
            res
        );
    }

};