const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const homeRouter = require('./routes/homeRouter.js');
const filialusznRouter = require('./routes/filialusznRouter.js');
const templateRouter = require('./routes/templateRouter.js');
const fs = require('fs');
const ini = require('ini');

const app = express();
const config = ini.parse(fs.readFileSync('config.ini', 'utf-8'));
const sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, {
    dialect: config.database.dialect,
    host: config.database.server,
    port: config.database.port,
    define: { timestamps: false}
});

app.set('view engine', 'ejs');

app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/filialuszn', filialusznRouter);
app.use('/template', templateRouter);
app.use('/', homeRouter);

app.use(function (req, res, next) {
    res.status(404).render('404.ejs');
});

async function server() {
    try {
        sequelize.sync().then(result => {
            app.listen(3000, () => console.log('Сервер ожидает подключения...'));
            // console.log(result)
        })
    }
    catch (err) {
        console.error(err);
    }
};

server();