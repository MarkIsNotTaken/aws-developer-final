const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const AWS = require('aws-sdk');
const path = require('path');
const home = require('./routes/home');
const order = require('./routes/new-order');
AWS.config.loadFromPath('./config.json');
let sqs = new AWS.SQS();

app.use(bodyParser.urlencoded({extended:true}))
app.use("/public", express.static(path.join(__dirname, 'public')));

app.set('view engine', '.hbs');

app.engine('.hbs', exphbs({
  extname:'.hbs',
  defaultLayout:'main',
}))

app.use('/', home)
app.use('/new-order', order)

app.listen(PORT, () => {
    console.log(`Server started, listening on ${PORT}`);
})

let queueParams = {
	QueueName: 'firstQueue'
}

createQueue = () => {
	sqs.createQueue(queueParams, (err, data) => {
		if (err) {console.log(err, err.stack)}
			else {console.log(data)}
	})
}