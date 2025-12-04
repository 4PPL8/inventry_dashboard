const express = require('express');
const router = express.Router();
const {
    getYears,
    getMonths,
    getDays,
    getDayDetails,
    searchLogs
} = require('../controllers/logsController');

router.get('/years', getYears);
router.get('/search', searchLogs); // Must be before :year param
router.get('/:year', getMonths);
router.get('/:year/:month', getDays);
router.get('/:year/:month/:day', getDayDetails);

module.exports = router;
