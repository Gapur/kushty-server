const express = require('express');

const Leaders = require('../models/leaders');
const authenticate = require('../authenticate');

const router = express.Router();

router.get('/', (req, res, next) => {
  Leaders.find({})
    .then((leaders) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Leaders.create(req.body)
    .then((leader) => {
      console.log('Leader Created ', leader);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.put('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /leaders');
});

router.delete('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Leaders.remove({})
    .then((leader) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.get('/:id', (req, res, next) => {
  Leaders.findById(req.params.id)
    .then((leader) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post('/:id', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end(`POST operation not supported on /leaders/${req.params.id}`);
});

router.put('/:id', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Leaders.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  }, { new: true })
    .then((leader) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.delete('/:id', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Leaders.findByIdAndRemove(req.params.id)
    .then((leader) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = router;
