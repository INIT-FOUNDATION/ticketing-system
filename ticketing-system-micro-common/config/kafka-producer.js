// const rdKafka = require('node-rdkafka');

// broker = 'localhost:9092'

// const initKafkaProducer = (topic_name, client_id) => {
//     let producer = rdKafka.Producer.createWriteStream({'metadata.broker.list': broker, 'client.id': client_id},{},{'topic': topic_name});
//     return producer;
// }

// // producer.on('error', (err) => {
// //     console.error('Error in our kafka stream');
// //     console.error(err);
// // });

// // const success = producer.write(Buffer.from(JSON.stringify(event)));  
// // if (success) {
// //     console.log(`message queued (${JSON.stringify(event)})`);
// // } else {
// //     console.log('Too many messages in the queue already..');
// // }
// module.exports.initKafkaProducer = initKafkaProducer;

