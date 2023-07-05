// const rdKafka = require('node-rdkafka');

// broker = 'localhost:9092'

// const initKafkaConsumer = (group_id, topics_list) => {
//     return new Promise((resolve, reject) => {
//         const consumer = rdKafka.KafkaConsumer({'group.id': group_id, 'metadata.broker.list': broker}, {});
//         consumer.connect();
//         consumer.on('ready', () => {
//             console.log('consumer ready..')
//             consumer.subscribe(topics_list).consume();
//             resolve(consumer);
//         });
//     })
// }

// module.exports.initKafkaConsumer = initKafkaConsumer;

