const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ title: 'Kushty' });
});

router.use('/dishes', require('./dishes'));
router.use('/promotions', require('./promotions'));
router.use('/leaders', require('./leaders'));
router.use('/users', require('./users'));

module.exports = router;
