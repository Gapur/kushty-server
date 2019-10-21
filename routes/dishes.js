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

router.get('/:id', (req, res, next) => {
  res.end(`Will send details of the dish: ${req.params.id} to you!`);
});

router.post('/:id', (req, res, next) => {
  res.statusCode = 403;
  res.end(`POST operation not supported on /dishes/${req.params.id}`);
});

router.put('/:id', (req, res, next) => {
  res.write(`Updating the dish: ${req.params.id}\n`);
  res.end(`Will update the dish: ${req.body.name} with details: ${req.body.description}`);
});

router.delete('/:id', (req, res, next) => {
  res.end(`Deleting dish: ${req.params.id}`);
});

module.exports = router;
