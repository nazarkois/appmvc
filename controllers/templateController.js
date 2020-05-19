const Template = require('../models/template.js');
const Filial = require('../models/filialuszn.js');
const Sequelize = require('sequelize');
const fs = require('fs');
// const http = require('http');
const request = require('request');
const ini = require('ini');

const config = ini.parse(fs.readFileSync('config.ini', 'utf-8'));
const Op = Sequelize.Op;

// Получить
exports.gettemplate = function (req, res) {
    Filial.findAll({ raw: true })
    .then(data => {
        res.render('template.ejs', {
            template: data,
            pathtem: config.paths.pathtem,
            pathfile: config.paths.pathfile,
            sqltext: config.paths.sqltext,
            chkall: config.paths.chkall,
            chkname: config.paths.chkname,
            chklabel: config.paths.chklabel
        });
    })
    .catch(err => {
        console.error(err);
        return res.sendStatus(400);
    });
};

// Выполнить
exports.posttemplate = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const user = config.database.user;
    const pass = config.database.password;
    const dial = config.database.dialect;
    const pathtem = req.body.pathtem;
    const pathfile = req.body.pathfile;
    const sqltext = req.body.sqltext;

    ArrParams = [];
    Filial.findAndCountAll()
    .then(query => { 
        for (i in query.rows) {
            if (query.rows[i].dataValues.check) {
                ArrParams.push({ sqltext: sqltext, db: query.rows[i].dataValues.db, user: user, pass: pass, dial: dial, server: query.rows[i].dataValues.server, port: query.rows[i].dataValues.port });
            }
        };
        Template.JSONtoCSV(ArrParams);;
    })
    .then(() => {
        config.paths.pathtem = pathtem;
        config.paths.pathfile = pathfile;
        config.paths.sqltext = sqltext;
        fs.writeFileSync('config.ini', ini.stringify(config, { section: '' }));
    })
    .then(() => {
        res.redirect('/template');
    })
    .catch(err => console.error(err));
};

// Чеки к филиалу
exports.checktemplate = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const id = req.params.id;
    const check = !!req.body.check;
    Filial.update({ check: check }, {where: {id: id}})
    .then(() => {
        res.redirect('/template');
    })
    .catch(err => console.error(err));
};

// Чеки к филиалам
exports.checkalltemplate  = (req, res) => {
    Filial.findAndCountAll()
    .then(qry => {
        let c = 0;
        for (i in qry.rows) {
            if (qry.rows[i].dataValues.check) { c++ }
        };

        if (c < qry.count) {
            Ochk = {
                check: 1,
                chkname: 'checkbox-checked',
                chklabel: 'Снять все филиалы'
            }
        }
        else {
            Ochk = {
                check: 0,
                chkname: 'checkbox',
                chklabel: 'Выбрать все филиалы'
            }
        };

        Filial.update({ check: Ochk.check }, { where: { id: { [Op.ne]: 0 } } })
        .then(() => {
            config.paths.chkall = Ochk.check;
            config.paths.chkname = Ochk.chkname;
            config.paths.chklabel = Ochk.chklabel;
            fs.writeFileSync('config.ini', ini.stringify(config, { section: '' }));
            res.redirect('/template');
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
};