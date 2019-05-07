const express = require('express');
const router = express.Router();
const yamlGenerator = require('../yamlGenerator');

router.post('/generateYAML' , yamlGenerator.BlockchainSetup);

module.exports = router;