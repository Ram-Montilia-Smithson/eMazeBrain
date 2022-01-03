const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const uri = process.env.MONGO_URI;
const db = mongoose.connection;
db.collection("users");
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const tokenMaxAge = 24 * 60 * 60;
const cookieMaxAge = tokenMaxAge * 1000;
const authCookieOptions = { maxAge: cookieMaxAge, httpOnly: true };

const userSchema = new mongoose.Schema({
    User_id: Number,
});

const User = mongoose.model('User', userSchema);

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => { console.log("Connected successfully to auth controller") });

const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: tokenMaxAge });
};

const verifyToken = (req) => {
    const token = req.cookies.auth;
    let dToken = null;
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
            if (!err) dToken = decodedToken;
        });
    };
    return dToken;
};

const isAuthenticated = (req, res, next) => {
    const token = verifyToken(req);
    if (token) return next();
    res.status(401).send('Unauthorized');
};

const auth = (req, res) => {
    const { UID } = req.query;
    if (UID) login(UID, res)
    else addNewUser(res)
}

const login = async (UID, res) => {
    User.findOne({ User_id: UID }, async (err, user) => {
        if (err) res.status(503).send(`${err}, Error connecting to mongo DB, Please try again`);
        else if (!user) res.status(404).send('Cannot find user, Please try again');
        else if (user) {
            const token = createToken(user._id);
            res.cookie('auth', token, authCookieOptions);
            res.status(200).json(user);
        };
    });
};

const addNewUser = (res) => {
    User.find((err, users) => {
        if (err) res.status(503).send(`${err}, Error connecting to mongo DB, Please try again`);
        else {
            const currentNumberOfUsers = users.length
            const user = new User({ User_id: currentNumberOfUsers + 1 });
            user.save(((err, user) => {
                if (err) res.status(503).send(`${err}, Error connecting to mongo DB, Please try again`);
                else if (!user) res.status(503).send("User addition process failed, Please try again");
                else if (user) {
                    const token = createToken(user._id);
                    res.cookie('auth', token, authCookieOptions)
                    res.status(201).json(user);
                };
            }));
        }
    });
};

module.exports = { auth, isAuthenticated };