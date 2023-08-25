require('dotenv').config();
const amqp = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5672';

const exchange = 'topic_logs';
const args = process.argv.slice(2);
const routingKeys = args.length > 0 ? args[0] : 'info';
const text = args.slice(1).join(' ') || 'Hello World!';

(async () => {
  let connection;
  try {
    connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, 'topic', { durable: false });

    channel.publish(exchange, routingKeys, Buffer.from(text));
    console.log(" [x] Sent %s:'%s'", routingKeys, text);

    await channel.close();
  } catch (err) {
    console.warn(err);
  } finally {
    if (connection) await connection.close();
  }
})();
