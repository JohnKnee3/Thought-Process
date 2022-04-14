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
router
  .route("/:thoughtId")
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

// /api/thoughts/<userId>
router.route("/:userId").post(addThought);

module.exports = router;
