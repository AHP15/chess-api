import cluster from "cluster";
import { cpus } from "os";
import app from "./app.js";

const numCPUs = cpus().length;
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