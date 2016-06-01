// Require dependencies
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import config from './config.js';

// Controllers
import TwitterCtrl from './controllers/TwitterCtrl';

// initilize app
const app = express();
// initilize dependencies
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


// Endpoints
// app.get('/model', modelCtrl.read);
// app.post('/model', modelCtrl.create);
// app.put('/model/:id', modelCtrl.update);
// app.delete('/model/:id', modelCtrl.delete);


//=======uncomment this for testing=======//
// TwitterCtrl.getDataByScreenName('devmtn');


// MongoDB connection
mongoose.set('debug', true);
mongoose.connect(config.mongoURI);
mongoose.connection.once('open', () => {
  console.log('Connected to mongo at: ', config.mongoURI);
});


// App Listen
app.listen(config.port, () => {
  console.log('listening on port ', config.port);
});
