const router = require("express").Router();
const {
  addThought,
  getAllThought,
  getThoughtById,
  updateThought,
  deleteThought,
} = require("../../controllers/thought-controller");

// /api/thoughts
router.route("/").get(getAllThought);

// /api/users/<thoughtId>
router.route("/:thoughtId").get(getThoughtById).put(updateThought);

// /api/thoughts/<userId>
router.route("/:userId").post(addThought);

// /api/thoughts/<userId>/<thoughtId>
router.route("/:userId/:thoughtId").delete(deleteThought);

module.exports = router;
