import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import requireDir from "require-dir"


//App init
const App = express();
App.use(express.json());
App.use(cors());

// DB init
mongoose.connect('mongodb://localhost:27017/api', { useNewUrlParser: true });

requireDir('./models');
App.use('/api', require('./routes'));

//port
App.listen(3001);

