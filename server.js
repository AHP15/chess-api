import cluster from "cluster";
import { cpus } from "os";
import app from "./app.js";
import DB from "./models/index.js";
import dotenv from "dotenv";

dotenv.config();

const numCPUs = cpus().length;

// connection to the DB
DB.mongoose.connect(process.env.CONNECTION_URL)
.then(() => {
    console.log("Connecting to the DB seccussfully!!");
})
.catch(err => {
    console.log("Error while connecting to the db", err);
    process.exit();
});


/*
if (cluster.isPrimary) {
    // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
}
else {
    const port = process.env.PORT ?? 8080;
    app.listen(port, () => {
        console.log("server listening on port ", port);
    });
}
*/
const port = process.env.PORT ?? 8080;
app.listen(port, () => {
  console.log("server listening on port ", port);
});