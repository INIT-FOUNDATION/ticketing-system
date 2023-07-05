//IMPORTS
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
// const {initKafkaProducer, initKafkaConsumer} = require("init-micro-common")

router.use(bodyParser.json({ limit: "5mb" }));
router.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));

// let kafkaProducer = initKafkaProducer('admin-topic', 'admin');

// kafkaProducer.on('error', (err) => {
//     console.error('Error in our kafka stream');
//     console.error(err);
// });

//ADMIN-SERVICE IS UP 
router.get('/', async (req, res) => {
    res.send("Admin service is up and running!!");
});




// const run = async () => {
//     let kafkaConsumer = await initKafkaConsumer('admin', ['admin-topic']);
//     kafkaConsumer.on('data', (data) => {
//         console.log(`received message admin from topic ${data.topic}: ${data.value}`);
//     });
// }

// run();

module.exports = router;