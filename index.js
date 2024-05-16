import express from "express";
import http from "node:http";
import https from "node:https";
import { hostname } from "node:os";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux";
import wisp from "wisp-server-node";

const app = express();
const server = http.createServer();
const server2 = https.createServer();

app.use('/src/static', express.static("src/static"));

app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/src/index.html");
});
app.get("/x", (req, res) => {
    res.sendFile(process.cwd() + "/src/proxy.html");
});
app.get("/about", (req, res) => res.sendFile(process.cwd() + "/src/about.html"));

app.use("/uv/sw.js", (req, res) => res.sendFile(process.cwd() + "/src/static/uv/sw.js"));
app.use("/uv/uv.config.js", (req, res) => res.sendFile(process.cwd() + "/src/static/uv/uv.config.js"));

app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));

app.use((req, res) => {
    res.status(404);
    res.sendFile(process.cwd() + "/src/404.html");
});

server.on("request", (req, res) => {
    /*res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");*/
    app(req, res);
});
server.on("upgrade", (req, socket, head) => {
    if (req.url.endsWith("/wisp/")) wisp.routeRequest(req, socket, head);
    else socket.end();
});

server2.on("request", (req, res) => {
    /*res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");*/
    app(req, res);
});
server2.on("upgrade", (req, socket, head) => {
    if (req.url.endsWith("/wisp/")) wisp.routeRequest(req, socket, head);
    else socket.end();
});

server.on("listening", () => {
    console.log(`Started on http://127.0.0.1:8080`);
});
server2.on("listening", () => {
    console.log(`Started on https://127.0.0.1:8443`);
});

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

function stop() { server.close(); server2.close(); }

server.listen(8080);
server2.listen(8443);