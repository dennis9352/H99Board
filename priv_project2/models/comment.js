const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  comment: String,
  postId: String,
  userId: String,
  nickname: String,
  order: Number,
});
CommentSchema.virtual("commentId").get(function () {
  return this._id.toHexString();
});
CommentSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("Comment", CommentSchema);