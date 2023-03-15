// implement your server here
// require your posts router and connect it here

const express = require("express");
const server = express();

const postsRouter = require("./posts/posts-router");
server.use("/api/posts", postsRouter);

server.use(express.json());

server.get("/", (req, res) => {
    res.send("root response");
});

module.exports = server;