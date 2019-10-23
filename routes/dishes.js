const express = require('express');

const Dishes = require('../models/dishes');

const router = express.Router();

router.get('/', (req, res, next) => {
  Dishes.find({})
    .then((dishes) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post('/', (req, res, next) => {
  Dishes.create(req.body)
    .then((dish) => {
      console.log('Dish Created ', dish);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.put('/', (req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /dishes');
});

router.delete('/', (req, res, next) => {
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
    .then((dish) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post('/:id', (req, res, next) => {
  res.statusCode = 403;
  res.end(`POST operation not supported on /dishes/${req.params.id}`);
});

router.put('/:id', (req, res, next) => {
  Dishes.findByIdAndUpdate(req.params.dishId, {
    $set: req.body,
  }, { new: true })
    .then((dish) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.delete('/:id', (req, res, next) => {
  Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = router;
