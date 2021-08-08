const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /dishes routes needed to make the tests pass
const controller = require("./dishes.controller");

router
  .route("/:dishId")
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed);

router
  .route("/")
  .post(controller.create)
  .put(controller.update)
  .get(controller.list)
  .all(methodNotAllowed);

module.exports = router;