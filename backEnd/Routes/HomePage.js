const express = require('express');
const router = express.Router();



router.route('/').get((req, res) => {
    res.json({ message: "Hello from the root route!" });
});

module.exports = router;