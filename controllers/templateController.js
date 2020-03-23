// const XlsxTemplate = require('xlsx-template');
const Template = require('../models/template.js');
const Filial = require('../models/filialuszn.js');
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
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
        console.log(err);
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

    config.paths.pathtem = pathtem;
    config.paths.pathfile = pathfile;
    config.paths.sqltext = sqltext;
    fs.writeFileSync('config.ini', ini.stringify(config, { section: '' }));
    
    Filial.findAndCountAll()
    .then(qry => {
        var one = true;
        for (var i = 0; i < qry.count; i++) {
            if (qry.rows[i].dataValues.check) {
                Template.templatefull(sqltext, qry.rows[i].dataValues.db, user, pass, dial, qry.rows[i].dataValues.server, qry.rows[i].dataValues.port, one);
                var one = false;
            }
        };
    })
    .finally(() => {
        Template.templatexlsx(pathtem, pathfile);
    })
    .catch(err => console.error(err));

    res.redirect('/template');
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
exports.checkalltemplate  = function (req, res) {
    Filial.findAndCountAll()
    .then(qry => {
        var c = 0;
        var c_all = qry.count;
        for (var i = 0; i < qry.count; i++) {
            if (qry.rows[i].dataValues.check) {
                var c = c + 1
            }
        };

        if (c < c_all)  {
            var Ochk = {
                check: 1,
                chkname: 'checkbox-checked',
                chklabel: 'Снять все филиалы'
            }
        }
        else {
            var Ochk = {
                check: 0,
                chkname: 'checkbox',
                chklabel: 'Выбрать все филиалы'
            }
        };

        Filial.update({ check: Ochk.check }, { where: { id: { [Op.ne]: 0 } } })
        .then(() => {
            res.redirect('/template');
        })
        .catch(err => console.error(err));

        config.paths.chkall = Ochk.check;
        config.paths.chkname = Ochk.chkname;
        config.paths.chklabel = Ochk.chklabel;
        fs.writeFileSync('config.ini', ini.stringify(config, { section: '' }));
    })
    .catch(err => console.error(err));
};
