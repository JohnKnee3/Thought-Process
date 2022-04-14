const router = require("express").Router();
const {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend,
} = require("../../controllers/user-controller");

// /api/users
router.route("/").post(createUser).get(getAllUser);

// /api/users/:id
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

// /api/users/<:userId>/friends/<:friendId>
router.route("/:userId/friends/:friendId").post(addFriend).delete(deleteFriend);

module.exports = router;
