const Users = require("../users/users-model");

function logger(req, res, next) {
  console.log(req.method);
  console.log(req.url);
  console.log(Date.now());

  next();
}

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then((user) => {
      if (!user) {
        next({
          message: "user not found",
          status: 404,
        });
      } else {
        req.user = user;
        next();
      }
    })
    .catch(next);
}

function validateUser(req, res, next) {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({
      message: "missing required name field",
    });
  }
  next();
}

function validatePost(req, res, next) {
  const { text } = req.body;
  if (!text) {
    res.status(400).json({
      message: "missing required text field",
    });
  }
  next();
}

// do not forget to expose these functions to other modules
module.exports = { logger, validateUserId, validateUser, validatePost };
