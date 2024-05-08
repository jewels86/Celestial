import express from "express";

const app = express();

app.use('/src/static', express.static("src/static"));

app.use((req, res) => {
    res.status(404);
    res.sendFile("src/404.html");
});

app.get("/uv/", (req, res) => {

});
app.get("/", (req, res) => {
    res.sendFile("src/index.html");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Started on port ${port}`);
});