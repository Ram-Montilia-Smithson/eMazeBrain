const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;
const db = mongoose.connection;
db.collection("tips");
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const tipSchema = new mongoose.Schema({
    tip_title: String,
    tip_body: String,
    brain_side: String,
    tip_number: Number
});

const Tip = mongoose.model('Tip', tipSchema);

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => { console.log("Connected successfully to tips controller") });


const readTip = (req, res) => {
    const { User_id } = req.body
    Tip.find((err, tips) => {
        if (err) res.status(503).send(`${err}, Error connecting to mongo DB, Please try again`);
        else if (!tips) res.status(404).send("No tips were found");
        else if (tips) {
            if (!User_id) res.status(203).json(tips)
            else {
                let NumberOfTips = tips.length
                let randomNumberOfTip = Math.ceil(Math.random() * NumberOfTips)
                Tip.findOne({ tip_number: randomNumberOfTip }, async (err, tip) => {
                    if (err) res.status(503).send(`${err}, Error connecting to mongo DB, Please try again`);
                    else if (!tip) res.status(404).send('Cannot find tip, Please try again');
                    else if (tip) {
                        const response = {
                            User_id: User_id,
                            tip_title: tip.tip_title,
                            tip_body: tip.tip_body
                        }
                        res.status(200).json(response);
                    };
                });
            }
        }
    });
}

const addTip = (req, res) => {
    const { tip_title, tip_body, brain_side } = req.body
    if (!tip_title || !tip_body || !brain_side) res.status(400).send("Tip information is missing, Please try again");
    else {
        Tip.find((err, tips) => {
            if (err) res.status(503).send(`${err}, Error connecting to mongo DB, Please try again`);
            else {
                const currentNumberOfTips = tips.length
                const newTip = req.body
                newTip.tip_number = currentNumberOfTips + 1
                const tip = new Tip(newTip);
                tip.save(((err, tip) => {
                    if (err) res.status(503).send(`${err}, Error connecting to mongo DB, Please try again`);
                    else if (!tip) res.status(503).send("Tip addition process failed, Please try again");
                    else if (tip) {
                        res.status(201).json(tip);
                    };
                }));
            }
        });
    }
}

module.exports = { readTip, addTip };