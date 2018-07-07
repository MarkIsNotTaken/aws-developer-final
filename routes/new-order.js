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
	let orderParams = {
			Message: 'Your order has been processed.',
			Subject: 'Order Status',
			TopicArn: process.env.TOPIC_ARN
		}
	sns.publish(orderParams, (err, data) => {
    		if (err) {
    			console.log(err, err.stack)
    		}
    		else {
    			console.log(data)
    	}			
	})
}

sendMessageQueue = (text) => {
	let messParams = {
			QueueUrl: process.env.QUEUE_URL,
			MessageBody: text,
			DelaySeconds: 0			
		}
    	sqs.sendMessage(messParams, (err, data) => {
			if (err) {
				console.log(`Error: ` + err)
			}
    		else {
    			console.log(data);
    			sendOrderStatus();
    		}
		})
}

router.route('/')
    .get((req, res) => {
        res.render('../views/new-order')
    })
	.post((req, res) => { 
		sendMessageQueue(req.body.formData)
    })

module.exports = router;