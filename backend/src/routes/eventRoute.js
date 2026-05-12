const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', eventController.getAllEvents);
router.get('/task/:taskId', eventController.getEventsByTaskId);

module.exports = router;