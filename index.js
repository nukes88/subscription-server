const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;


app.use(cors());
app.use(express.json());

app.post('/create-sub', (req, res) => {
    console.log(req.body)
    let data = req.body;
    if (!data) {
        throw new Error('No data')
    }

    let amount = data.amount;
    let type = data.type;
    let subStart = new Date(data.subStart.y, data.subStart.m, data.subStart.d);
    let subEnd = new Date(data.subEnd.y, data.subEnd.m, data.subEnd.d);
    let subDay = data.subDay;
    let timezoneOffset = data.timezoneOffset;
    let invoices = [];

    let offset = -1 * (timezoneOffset * 60 * 1000);

    subStart.setTime(subStart.getTime() + offset);
    subEnd.setTime(subEnd.getTime() + offset);

    switch (type) {
        case 'd': {
            while (subStart <= subEnd) {
                invoices.push(formatDate(subStart.getTime()));
                subStart.setDate(subStart.getDate() + 1);
            }
            console.log(invoices)
        }
            break;
        case 'w': {
            console.log('sub day is', subDay)
            if (!subDay) {
                throw new Error('No sub day');
            }

            while (subStart <= subEnd) {
                if (subStart.getDay().toString() == subDay) {
                    invoices.push(formatDate(subStart.getTime()));
                }
                subStart.setDate(subStart.getDate() + 1);
            }
            console.log(invoices)
        }
            break;
        case 'm':
            console.log('sub day is', subDay)
            if (!subDay) {
                throw new Error('No sub day');
            }

            while (subStart <= subEnd) {
                if (subStart.getDate().toString() == subDay) {
                    invoices.push(formatDate(subStart.getTime()));
                }
                subStart.setDate(subStart.getDate() + 1);
            }
            console.log(invoices)
            break;
        default:
    }

    res.json({
        amount: amount,
        type: type,
        invoices: invoices
    })
})

function formatDate(time) {
    let d = new Date(time);
    let day = d.getDate()
    let dayStr = day.toString();
    if (day < 10) {
        dayStr = '0' + dayStr;
    }
    let month = parseInt(d.getMonth()) + 1;
    let monthStr = month.toString();
    if (month < 10) {
        monthStr = '0' + monthStr;
    }
    return dayStr + '/' + monthStr + '/' + d.getFullYear()
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})