const mongoose = require('mongoose');
const Comment = require('../models/comment');

exports.get__all__comments = (req, res, next) => {
  Comment.find()
    .populate({
      path: 'product',
      select: '_id name',
      populate: {
        path: 'saler',
        select: '_id username avatar',
      },
    })
    .populate({path: 'commentator', select: '_id username avatar'})
    .populate({
      path: 'subComment.sender',
      select: '_id username avatar',
    })
    .populate({
      path: 'subComment.receiver',
      select: '_id username avatar',
    })
    .select('-__v')
    .exec()
    .then((comments) =>
      res.status(200).json({counter: comments.length, comments})
    )
    .catch((error) => console.log(error));
};

exports.create__main__comment = (req, res, next) => {
  const {product, mainComment} = req.body;
  const commentator = req.currentUser;
  let newComment = new Comment({
    product,
    mainComment,
    commentator,
  });

  newComment
    .save()
    .then((doc) => {
      return res.status(200).json({doc, message: 'comment created'});
    })
    .catch((error) => res.send(error));
};

exports.get__comment__of__product = (req, res, next) => {
  const {productId} = req.params;
  Comment.find({
    product: {
      _id: productId,
    },
  })
    .populate({
      path: 'product',
      select: '_id name',
      populate: {
        path: 'saler',
        select: '_id username avatar',
      },
    })
    .populate({path: 'commentator', select: '_id username avatar'})
    .populate({
      path: 'subComment.sender',
      select: '_id username avatar',
    })
    .populate({
      path: 'subComment.receiver',
      select: '_id username avatar',
    })
    .select('-__v')
    .then((docs) => {
      return res.status(200).json({docs});
    })
    .catch((error) => console.log(error));
};

exports.update__main__comment = async (req, res, next) => {
  const {commentId} = req.params;
  const {mainComment} = req.body;
  await Comment.findByIdAndUpdate(commentId, {$set: {mainComment}})
    .exec()
    .then((doc) => {
      res.status(200).json({
        mainComment,
        doc,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};

exports.get__comment = (req, res, next) => {
  const {commentId} = req.params;
  Comment.findById(commentId)
    .exec()
    .then((doc) => {
      return res.status(200).json({doc});
    })
    .catch((error) => console.log(error));
};

exports.delete__main__comment = (req, res, next) => {
  const {commentId} = req.params;
  Comment.findByIdAndDelete(commentId)
    .exec()
    .then((doc) => {
      return res.status(200).json({doc, message: 'comment was deleted'});
    })
    .catch((error) => console.log(error));
};

exports.create__sub__comment = (req, res, next) => {
  const {commentId} = req.params;
  const {content, sender, receiver} = req.body;
  const subContent = {content, sender, receiver};

  Comment.update(
    {_id: commentId},
    {$push: {subComment: subContent}},
    (err, doc) => {
      if (err) {
        console.log(err);
      }
      return res
        .status(200)
        .json({doc, subContent, message: 'comment was updated'});
    }
  );
};

exports.comment_update_subComment = (req, res, next) => {
  const {commentId} = req.params;
  const {newContent} = req.body;

  Comment.update(
    {'subComment._id': commentId},
    {
      $set: {
        'subComment.$.content': newContent,
      },
    }
  )
    .exec()
    .then((doc) => {
      return res
        .status(200)
        .json({message: 'subComment was updated', newContent, doc});
    })
    .catch((error) => {
      return res.status(400).json({error});
    });
};

exports.comment_delete_subComment = (req, res, next) => {
  const {commentId} = req.params;
  const {subCommentId} = req.body;

  Comment.findByIdAndUpdate(
    {_id: commentId},
    {
      $pull: {subComment: {_id: subCommentId}},
    }
  )
    .exec()
    .then((doc) => {
      return res.status(200).json({message: 'subComment was deleted', doc});
    })
    .catch((error) => {
      return res.status(400).json({error});
    });
};
