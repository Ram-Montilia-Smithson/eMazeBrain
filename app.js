const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { isAuthenticated, auth } = require('./src/auth');
const { readTip, addTip } = require('./src/tip');


const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded());

app.get('/auth', auth)

app.post('/tip', isAuthenticated, readTip)

app.post('/add_tip', isAuthenticated, addTip)

app.get('/', (req, res) => {
    res.send("Hello World!")
})

app.listen(port, () => {
    console.log(`Example app listening at https://emazebrain.herokuapp.com:${port}`)
})