const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /dishes routes needed to make the tests pass
const controller = require("./orders.controller");

router
  .route("/:orderId")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete)
  .all(methodNotAllowed);

router
  .route("/")
  .post(controller.create)
  .put(controller.update)
  .get(controller.list)
  .all(methodNotAllowed);

module.exports = router;
