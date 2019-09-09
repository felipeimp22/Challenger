import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import requireDir from 'require-dir';

// App init
const App = express();
App.use(express.json());
App.use(cors());

// DB init
// mongoose.connect('mongodb://localhost:27017/api', { useNewUrlParser: true });
mongoose
  .connect('mongodb://apphourdb:App123456@ds018538.mlab.com:18538/apphour', {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('Success conected to Database');
  })
  .catch(() => {
    console.log('Could not connect on Database');
    process.exit();
  });

requireDir('./models');
App.use('/api', require('./routes'));

// port
const port = 3001;
App.listen(port, () => {
  console.log(`Server connected on port:${port}`);
});
