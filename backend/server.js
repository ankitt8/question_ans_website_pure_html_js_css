const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const bodyParser = require('body-parser')
// load config
dotenv.config({ path: './config/config.env' })

const connectDB = require('./config/db')

const app = express();

// set public folder to server frontend
app.use(express.static(path.join(__dirname, '..', 'public')))
// use bodyParser to parse req.body
const jsonParser = bodyParser.json();

// set routes
app.use('/', jsonParser, require('./routes/index'))


const PORT = process.env.PORT || 3000;
try {
    app.listen(PORT, () => { console.log(`server running at port ${PORT}`) })
    connectDB();
} catch (error) {
    console.log(error)
}
