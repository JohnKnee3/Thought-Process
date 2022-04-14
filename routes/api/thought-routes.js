const router = require("express").Router();
const {
  addThought,
  getAllThought,
  getThoughtById,
} = require("../../controllers/thought-controller");

// /api/thoughts
router.route("/").get(getAllThought);

// /api/users/<thoughtId>
router.route("/:id").get(getThoughtById);

// /api/thoughts/<userId>
router.route("/:userId").post(addThought);

module.exports = router;
