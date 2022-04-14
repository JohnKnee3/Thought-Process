const router = require("express").Router();
const {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../../controllers/user-controller");

// /api/users
router.route("/").post(createUser).get(getAllUser);

// /api/users/:id
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
