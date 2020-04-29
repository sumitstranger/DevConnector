const express = require('express');
const router = express.Router();

// @router GET api/postss
// @desc   Test route
// @access profile
router.get('/', (req, res) => res.send('postssrouter'));

module.exports = router;
