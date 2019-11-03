const express = require('express');
const mongoose = require('mongoose');

const { Dishes } = require('../models/dishes');
const authenticate = require('../authenticate');

const router = express.Router();
const { ObjectId } = mongoose.Types;

router.get('/', (req, res, next) => {
  Dishes.find({})
    .populate('comments.author')
    .then((dishes) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Dishes.create(req.body)
    .then((dish) => {
      console.log('Dish Created ', dish);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.put('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /dishes');
});

router.delete('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Dishes.remove({})
    .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.get('/:id', (req, res, next) => {
  Dishes.findById(req.params.id)
    .populate('comments.author')
    .then((dish) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post('/:id', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end(`POST operation not supported on /dishes/${req.params.id}`);
});

router.put('/:id', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Dishes.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  }, { new: true })
    .then((dish) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.delete('/:id', authenticate.verifyAdmin, authenticate.verifyUser, (req, res, next) => {
  Dishes.findByIdAndRemove(req.params.id)
    .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.get('/:id/comments', (req, res, next) => {
  Dishes.findById(req.params.id)
    .populate('comments.author')
    .then((dish) => {
      if (dish != null) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish.comments);
      } else {
        const err = new Error(`Dish ${req.params.id} not found`);
        err.status = 404;
        return next(err);
      }
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post('/:id/comments', authenticate.verifyUser, (req, res, next) => {
  Dishes.findById(req.params.id)
    .then((dish) => {
      if (dish != null) {
        req.body.author = req.user._id;
        dish.comments.push(req.body);
        dish.save()
          .then((updatedDish) => {
            Dishes.findById(updatedDish._id)
              .populate('comments.author')
              .then((newDish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(newDish);
              });
          }, (err) => next(err));
      } else {
        const err = new Error(`Dish ${req.params.id} not found`);
        err.status = 404;
        return next(err);
      }
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.put('/:id/comments', authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403;
  res.end(`PUT operation not supported on /dishes/${req.params.id}/comments`);
});

router.delete('/:id/comments', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Dishes.findById(req.params.id)
    .then((dish) => {
      if (dish != null) {
        for (let i = (dish.comments.length - 1); i >= 0; i--) {
          dish.comments.id(dish.comments[i]._id).remove();
        }
        dish.save()
          .then((updatedDish) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(updatedDish);
          }, (err) => next(err));
      } else {
        const err = new Error(`Dish ${req.params.id} not found`);
        err.status = 404;
        return next(err);
      }
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.get('/:id/comments/:commentId', (req, res, next) => {
  Dishes.findById(req.params.id)
    .populate('comments.author')
    .then((dish) => {
      if (dish != null && dish.comments.id(req.params.commentId) != null) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish.comments.id(req.params.commentId));
      } else if (dish == null) {
        const err = new Error(`Dish ${req.params.id} not found`);
        err.status = 404;
        return next(err);
      } else {
        const err = new Error(`Comment ${req.params.commentId} not found`);
        err.status = 404;
        return next(err);
      }
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post('/:id/comments/:commentId', authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403;
  res.end(`POST operation not supported on /dishes/${req.params.id}/comments/${req.params.commentId}`);
});

router.put('/:id/comments/:commentId', authenticate.verifyUser, (req, res, next) => {
  Dishes.findById(req.params.id)
    .populate('comments.author')
    .then((dish) => {
      if (dish != null && dish.comments.id(req.params.commentId) != null) {
        const id1 = ObjectId(dish.comments.id(req.params.commentId).author._id);
        const id2 = ObjectId(req.user._id);
        if (dish && !id1.equals(id2)) {
          const err = new Error('Any user or an Admin cannot update or delete the comment posted by other users!');
          err.status = 403;
          return next(err);
        }
        if (req.body.rating) {
          dish.comments.id(req.params.commentId).rating = req.body.rating;
        }
        if (req.body.comment) {
          dish.comments.id(req.params.commentId).comment = req.body.comment;
        }
        dish.save()
          .then((savedDish) => {
            Dishes.findById(savedDish._id)
              .populate('comments.author')
              .then((updatedDish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(updatedDish);
              });
          }, (err) => next(err));
      } else if (dish == null) {
        const err = new Error(`Dish ${req.params.id} not found`);
        err.status = 404;
        return next(err);
      } else {
        const err = new Error(`Comment ${req.params.commentId} not found`);
        err.status = 404;
        return next(err);
      }
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.delete('/:id/comments/:commentId', authenticate.verifyUser, (req, res, next) => {
  Dishes.findById(req.params.id)
    .populate('comments.author')
    .then((dish) => {
      if (dish != null && dish.comments.id(req.params.commentId) != null) {
        const id1 = ObjectId(dish.comments.id(req.params.commentId).author._id);
        const id2 = ObjectId(req.user._id);
        if (dish && !id1.equals(id2)) {
          const err = new Error('Any user or an Admin cannot update or delete the comment posted by other users!');
          err.status = 403;
          return next(err);
        }
        dish.comments.id(req.params.commentId).remove();
        dish.save()
          .then((savedDish) => {
            Dishes.findById(savedDish._id)
              .populate('comments.author')
              .then((updatedDish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(updatedDish);
              });
          }, (err) => next(err));
      } else if (dish == null) {
        const err = new Error(`Dish ${req.params.id} not found`);
        err.status = 404;
        return next(err);
      } else {
        const err = new Error(`Comment ${req.params.commentId} not found`);
        err.status = 404;
        return next(err);
      }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = router;
