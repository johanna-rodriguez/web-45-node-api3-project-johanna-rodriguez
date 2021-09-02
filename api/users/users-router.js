const express = require("express");
const Post = require("../posts/posts-model");
const Users = require("./users-model");
const {
  logger,
  validateUserId,
  validateUser,
  validatePost,
} = require("../middleware/middleware");

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get("/", logger, (req, res, next) => {
  Users.get(req.query)
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(next);
});

router.get("/:id", logger, validateUserId, (req, res, next) => {
  res.json(req.user);
});

router.post("/", validateUser, (req, res, next) => {
  const { name } = req.body;

  Users.insert({ name })
    .then((post) => {
      res.status(201).json(post);
    })
    .catch(next);
});

router.put("/:id", validateUser, (req, res, next) => {});

router.delete("/:id", (req, res, next) => {
  Users.getById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).json({
          message: "user not found",
        });
      } else {
        Users.remove(req.params.id);
        res.json(user);
      }
    })
    .catch(next);
});

router.get("/:id/posts", (req, res, next) => {
  Post.getById(req.params.id)
    .then((post) => {
      if (!post) {
        res.status(404).json({
          message: "post not found",
        });
      } else {
        res.json(post);
      }
    })
    .catch(next);
});

router.post("/:id/posts", validatePost, (req, res, next) => {
  const { text } = req.body;

  Users.getById(req.params.id).then((user) => {
    if (!user) {
      res.status(404).json({
        message: "user id does not exist",
      });
    } else {
      const user_id = user.id;
      Post.insert({ text, user_id })
        .then((post) => {
          res.status(201).json(post);
        })
        .catch(next);
    }
  });
});

router.use((err, req, res, next) => {
  console.log(err.message);
  res.status(err.status || 500).json({
    message: err.message,
    customMessage: "another message",
  });
});

// do not forget to export the router
module.exports = router;
