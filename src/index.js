const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
dotenv.config();

const PORT = process.env.PORT;
app.use(express.json());

app.get("/posts", async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.send({
      data: posts,
      message: "get posts success",
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

app.get("/posts/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });
    if (!post) throw Error("Post not found");
    res.send({
      data: post,
      message: "get post success",
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

app.post("/posts", async (req, res) => {
  try {
    const data = req.body;
    if (!(data.title && data.content)) {
      throw Error("Some fields are missing");
    }
    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
      },
    });
    res.send({
      data: post,
      message: "insert post success",
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

app.put("/posts/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let post = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });
    if (!post) throw Error("Post not found");
    const data = req.body;
    if (!(data.title && data.content)) {
      throw Error("Some fields are missing");
    }
    post = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        title: data.title,
        content: data.content,
      },
    });
    res.send({
      data: post,
      message: "edit post success",
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

app.delete("/posts/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });
    if (!post) throw Error("Post not found");
    await prisma.post.delete({
      where: {
        id: id,
      },
    });
    res.send({
      message: "delete post success",
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log("Express running in port: " + PORT);
});
