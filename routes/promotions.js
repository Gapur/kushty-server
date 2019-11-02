const express = require('express');

const Promotions = require('../models/promotions');
const authenticate = require('../authenticate');

const router = express.Router();

router.get('/', (req, res, next) => {
  Promotions.find({})
    .then((promotions) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Promotions.create(req.body)
    .then((promotion) => {
      console.log('Promotion Created ', promotion);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.put('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /promotions');
});

router.delete('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Promotions.remove({})
    .then((promotion) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.get('/:id', (req, res, next) => {
  Promotions.findById(req.params.id)
    .then((promotion) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post('/:id', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end(`POST operation not supported on /promotions/${req.params.id}`);
});

router.put('/:id', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Promotions.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  }, { new: true })
    .then((promotion) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.delete('/:id', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Promotions.findByIdAndRemove(req.params.id)
    .then((promotion) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = router;
