const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ title: 'Kushty' });
});

router.use('/dishes', require('./dishes'));

module.exports = router;
