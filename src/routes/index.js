const express = require('express');
const authRoutes = require('./authRoutes')
const taskRoutes = require('./taskRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/task', taskRoutes);

module.exports = router;