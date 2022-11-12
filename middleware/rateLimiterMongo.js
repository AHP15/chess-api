import DB from "../models/index.js";
import {RateLimiterMongo} from "rate-limiter-flexible";

const opts = {
    storeClient: DB.mongoose.connection,
    keyPrefix: 'middleware',
    points: 10, // Number of points
    duration: 1, // Per second(s)
};

const rateLimiterMongo = new RateLimiterMongo(opts);

const rateLimiterMiddleware = (req, res, next) => {
    rateLimiterMongo.consume(req.ip)
      .then(() => {
        next();
      })
      .catch(() => {
        res.status(429).send('Too Many Requests');
      });
};

export default rateLimiterMiddleware;