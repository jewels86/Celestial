import express from "express";
import { createServer } from "node:http";
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

server.on("upgrade", (req, socket, head) => {
    if (req.url.endsWith("/wisp/"))
      wisp.routeRequest(req, socket, head);
    else
      socket.end();
  });
app.use((req, res) => {
    res.status(404);
    res.sendFile(process.cwd() + "/src/404.html");
});


const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});