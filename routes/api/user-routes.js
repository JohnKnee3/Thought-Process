const router = require("express").Router();
const {
  createUser,
  getAllUser,
  getUserById,
} = require("../../controllers/user-controller");

// /api/users
router.route("/").post(createUser).get(getAllUser);

// /api/users/:id
router.route("/:id").get(getUserById);

module.exports = router;
