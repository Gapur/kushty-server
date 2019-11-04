const express = require('express');

const Favorites = require('../models/favorites');
const authenticate = require('../authenticate');

const router = express.Router();

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
  Favorites.findOne({ user: req.user._id })
    .then((favorite) => {
      if (favorite == null) {
        const data = { dishes: req.body, user: req.user._id };
        Favorites.create(data)
          .then((favorites) => {
            console.log('Favorites Created ', favorites);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
          }, (err) => next(err));
      } else {
        const dishes = req.body.reduce((acc, curr) => (favorite.dishes.includes(curr._id)
          ? acc : acc.concat(curr._id)), []);
        if (dishes.length === 0) {
          const err = new Error('Favorites should contain unique dishes');
          return next(err);
        }
        favorite.dishes.push(dishes);
        favorite.save()
          .then((savedFavorites) => {
            console.log('Added ', savedFavorites);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(savedFavorites);
          }, (err) => next(err));
      }
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
  Favorites.findOne({ user: req.user._id })
    .then((favorite) => {
      if (favorite == null) {
        const err = new Error('You don\' have favorites');
        return next(err);
      }

      if (favorite.dishes.includes(req.params.dishId)) {
        const err = new Error(`Dish ${req.params.dishId} is already exist in favorites`);
        return next(err);
      }

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
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.delete('/:dishId', authenticate.verifyUser, (req, res, next) => {
  Favorites.findOne({ user: req.user._id })
    .then((favorite) => {
      if (favorite == null) {
        const err = new Error('You don\' have favorites');
        return next(err);
      }

      if (!favorite.dishes.includes(req.params.dishId)) {
        const err = new Error(`You don't have ${req.params.dishId} in your favorites`);
        return next(err);
      }

      favorite.dishes.remove(req.params.dishId);
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
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = router;
