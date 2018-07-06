require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
var sqs = new AWS.SQS();
var sns = new AWS.SNS();

sendOrderStatus = () => {
	var sendMessage = {
		Message: 'Your order has been processed.',
		Subject: 'Order Status',
		TopicArn: process.env.TOPIC_ARN
	};
	sns.publish(sendMessage, (err, data) => {
    	if (err) {console.log(err, err.stack)}
    		else {console.log(data)}
	})
}

router.route('/')
    .get((req, res) => {
        res.render('../views/new-order')
    })
	.post((req, res) => {
		var messageParam = {
			MessageBody: JSON.stringify(req.body.formData),
			QueueUrl: process.env.QUEUE_URL
		};
		sqs.sendMessage(messageParam, (err, data) => {
			if (err) {console.log(err, err.stack)}
    		else {console.log(data), sendOrderStatus()}
		})
    })

module.exports = router;