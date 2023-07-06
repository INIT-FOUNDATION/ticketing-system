//IMPORTS
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
// const {initKafkaProducer, initKafkaConsumer} = require("ticketing-system-micro-common")

router.use(bodyParser.json({ limit: "5mb" }));
router.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));

//ADMIN-SERVICE IS UP 
router.get('/', async (req, res) => {
    res.send("Admin service is up and running!!");
});



module.exports = router;