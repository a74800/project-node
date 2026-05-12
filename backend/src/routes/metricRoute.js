const express = require('express');
const router = express.Router();
const metricController = require('../controllers/metricController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/tasks/status', metricController.getTaskCountsByStatus);
router.get('/events/types', metricController.getEventCountsByType);

module.exports = router;