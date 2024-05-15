import express from "express";
import { createServer } from "node:http";
import { hostname } from "node:os";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux";
import wisp from "wisp-server-node";

const app = express();
const server = createServer();

app.use('/src/static', express.static("src/static"));

app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/src/index.html");
});
app.get("/x", (req, res) => {
    res.sendFile(process.cwd() + "/src/proxy.html");
});

app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));

app.use((req, res) => {
    res.status(404);
    res.sendFile(process.cwd() + "/src/404.html");
});

server.on("request", (req, res) => {
    app(req, res);
});
server.on("upgrade", (req, socket, head) => {
    if (req.url.endsWith("/wisp/")) wisp.routeRequest(req, socket, head);
    else socket.end();
});


const port = process.env.PORT || 8080;

server.on("listening", () => {
    console.log(`Started on 127.0.0.1:${port}`)
});

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

function stop() { server.close(); }

server.listen(port);