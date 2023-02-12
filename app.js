import express from "express";
import helmet  from "helmet";
import userRouter from "./routes/user.route.js";
import gameRouter from "./routes/game.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
// can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately
// visit https://helmetjs.github.io/ for more info
app.use(helmet());

// Note: Disabling the X-Powered-By header does not prevent a sophisticated attacker from determining that an app is running Express
app.disable('x-powered-by');

const corsOptions = {
    origin: 'https://chess-client-indol.vercel.app/',
    credentials: true,
}
app.use(cors(corsOptions));

app.use("/api/v1", userRouter);
app.use("/api/v1", gameRouter);
app.get("/", (req, res) => res.send({ message: "This is a Rest api for a chess app" }));



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