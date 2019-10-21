const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.end('Will send all the dishes to you!');
});

router.post('/', (req, res, next) => {
  res.end(`Will add the dish: ${req.body.name} with details: ${req.body.description}`);
});

router.put('/', (req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /dishes');
});

router.delete('/', (req, res, next) => {
  res.end('Deleting all dishes');
});

router.get('/:dishId', (req, res, next) => {
  res.end(`Will send details of the dish: ${req.params.dishId} to you!`);
});

router.post('/:dishId', (req, res, next) => {
  res.statusCode = 403;
  res.end(`POST operation not supported on /dishes/${req.params.dishId}`);
});

router.put('/:dishId', (req, res, next) => {
  res.write(`Updating the dish: ${req.params.dishId}\n`);
  res.end(`Will update the dish: ${req.body.name} with details: ${req.body.description}`);
});

router.delete('/:dishId', (req, res, next) => {
  res.end(`Deleting dish: ${req.params.dishId}`);
});

module.exports = router;
