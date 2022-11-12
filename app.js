import express from "express";
import DB from "./models/index.js";
import helmet  from "helmet";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";

dotenv.config();

const app = express();
app.use(express.json())
// can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately
// visit https://helmetjs.github.io/ for more info
app.use(helmet());

// Note: Disabling the X-Powered-By header does not prevent a sophisticated attacker from determining that an app is running Express
app.disable('x-powered-by');


// connection to the DB
DB.mongoose.connect(process.env.CONNECTION_URL)
.then(() => {
    console.log("Connecting to the DB seccussfully!!");
    import("./middleware/rateLimiterMongo.js").then(rateLimiterMiddleware => {
    // counts and limits number of actions by key and protects from 
    // DDoS and brute force attacks at any scale
        app.use(rateLimiterMiddleware.default);
    });
})
.catch(err => {
    console.log("Error while connecting to the db", err);
    process.exit();
});


app.use("/api/v1", userRouter);
app.get("/", (req, res) => {
    res.json('Hello world');
});



// custom 404
app.use((req, res, next) => {
    res.status(404).send("Page Not Found!");
});

// custom error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({message: err?.message ?? "Something went wrong!"});
});

export default app;