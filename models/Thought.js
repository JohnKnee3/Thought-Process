const { Schema, model, Types } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      maxlength: 128,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    userName: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      getters: true,
    },
    // id: false,
  }
);

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
