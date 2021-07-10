const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: String,
    context: String,
    order: Number,
    channel: String,
    userId: String,
    nickname: String,
    view: Number,
    date: String,
  },
  {
    timestamps: true,
  }
);
PostSchema.virtual('postId').get(function () {
  return this._id.toHexString();
});
PostSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Post', PostSchema);
