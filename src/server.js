const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
const posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

function idUnico() {
  // function closure
  let id = 0;
  return function () {
    id = id + 1;
    return id;
  };
}

const newId = idUnico(); // instancio la closure

// TODO: your code to handle requests
// Guarda un post
server.post("/posts", (req, res) => {
  const { author, title, contents } = req.body;
  if (author && title && contents) {
    const newPost = {
      id: newId(),
      author,
      title,
      contents,
    };
    posts.push(newPost);
    return res.json(newPost);
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  }
});
//Crea un post de un author especifico
server.post("/posts/author/:author", (req, res) => {
  const { title, contents } = req.body;
  if (title && contents) {
    const newPost = {
      id: newId(),
      author: req.params.author,
      title,
      contents,
    };
    posts.push(newPost);
    return res.json(newPost);
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  }
});
//Muestra todos los posts
server.get("/posts", (req, res) => {
  let finds = [];
  if (req.query.term) {
    posts.forEach(function (element) {
      if (
        element.title.includes(req.query.term) ||
        element.contents.includes(req.query.term)
      ) {
        finds.push(element);
      }
    });
    return res.json(finds);
  } else {
    return res.json(posts);
  }
});
//muestra los post por author
server.get("/posts/:author", (req, res) => {
  let finds = [];
  posts.forEach(function (post) {
    if (post.author.includes(req.params.author)) {
      finds.push(post);
    }
  });
  if (finds.length === 0) {
    return res
      .status(STATUS_USER_ERROR)
      .json({ error: "No existe ningun post del autor indicado" });
  } else {
    return res.json(finds);
  }
});
//Busca titulo del author
server.get("/posts/:author/:title", (req, res) => {
  let finds = [];
  posts.forEach(function (post) {
    if (
      post.author.includes(req.params.author) &&
      post.title.includes(req.params.title)
    ) {
      finds.push(post);
    }
  });
  if (finds.length === 0) {
    return res.status(STATUS_USER_ERROR).json({
      error: "No existe ningun post con dicho titulo y autor indicado",
    });
  } else {
    return res.json(finds);
  }
});
//modificar post
server.put("/posts", (req, res) => {
  const { id, title, contents } = req.body;
  if (id && title && contents) {
    var index = posts
      .map((x) => {
        return x.id;
      })
      .indexOf(req.body.id);
    if (posts[index]) {
      posts[index].title = title;
      posts[index].contents = contents;
      res.json(posts[index]);
    } else {
      return res.status(STATUS_USER_ERROR).json({
        error:
          "No se recibieron los parámetros necesarios para modificar el Post",
      });
    }
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error:
        "No se recibieron los parámetros necesarios para modificar el Post",
    });
  }
});
// delete posts
server.delete("/posts", (req, res) => {
  const { id } = req.body;
  if (id) {
    var index = posts
      .map((x) => {
        return x.id;
      })
      .indexOf(req.body.id);
    if (posts[index]) {
      posts.splice(index, 1);
      res.json({ success: true });
    } else {
      return res.status(STATUS_USER_ERROR).json({ error: "Mensaje de error" });
    }
  } else {
    return res.status(STATUS_USER_ERROR).json({ error: "Mensaje de error" });
  }
});
// delete author
server.delete("/author", (req, res) => {
  const { author } = req.body;
  if (author) {
    const isFound = posts.filter(
      (element) => element.author == req.body.author
    );
    if (isFound.length !== 0) {
      isFound.map((item) => {
        let indice = posts.indexOf(item);
        posts.splice(indice, 1);
      });
      res.json(isFound);
    } else {
      return res
        .status(STATUS_USER_ERROR)
        .json({ error: "No existe el autor indicado" });
    }
  } else {
    return res.status(STATUS_USER_ERROR).json({ error: "Mensaje de error" });
  }
});
module.exports = { posts, server };
