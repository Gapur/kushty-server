const express = require('express');
const mongoose = require('mongoose');

const Favorites = require('../models/favorites');
const authenticate = require('../authenticate');

const router = express.Router();
const { ObjectId } = mongoose.Types;

router.get('/', (req, res, next) => {
  Favorites.findOne({ user: req.user._id })
    .populate('user', 'dishes')
    .then((favorite) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post('/', authenticate.verifyUser, (req, res, next) => {
  const data = { dishes: req.body, user: req.user._id };
  Favorites.create(data)
    .then((favorites) => {
      console.log('Favorites Created ', favorites);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.delete('/', authenticate.verifyUser, (req, res, next) => {
  Favorites.deleteOne({ user: req.user._id })
    .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post('/:dishId', authenticate.verifyUser, (req, res, next) => {
  Favorites.findOne({ user: req.user._id, dishes: { $nin: [req.params.dishId] } })
    .then((favorite) => {
      if (favorite != null) {
        favorite.dishes.push(req.params.dishId);
        favorite.save()
          .then((updatedFavorite) => {
            Favorites.findById(updatedFavorite._id)
              .populate('user', 'dishes')
              .then((newFavorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(newFavorites);
              });
          }, (err) => next(err));
      } else {
        const err = new Error(`Dish ${req.params.dishId} is already exist in favorites`);
        return next(err);
      }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = router;
