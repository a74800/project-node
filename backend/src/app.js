const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/healthRoutes');
const taskRoutes = require('./routes/taskRoutes');
const metricRoutes = require('./routes/metricRoute');
const eventRoutes = require('./routes/eventRoute');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/health', healthRoutes);

app.use('/tasks', taskRoutes);
app.use('/events', eventRoutes);
app.use('/metrics', metricRoutes);

module.exports = app;