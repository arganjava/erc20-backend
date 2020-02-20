const express = require('express')
var router = express.Router()

router.get('/balanceOf', async function (req, res) {
    res.send({balance: 1});
})

module.exports = router;