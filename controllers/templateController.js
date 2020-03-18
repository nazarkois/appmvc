const Template = require('../models/template.js');
const FilialUSZN = require('../models/filialuszn.js');
const fs = require('fs');
const ini = require('ini');

const config = ini.parse(fs.readFileSync('config.ini', 'utf-8'));

// Получить
exports.gettemplate = function (req, res) {
    FilialUSZN.findAll({ raw: true }).then( data => {
        res.render('template.ejs', {
            template: data,
            pathtem: config.paths.pathtem,
            pathfile: config.paths.pathfile,
            sqltext: config.paths.sqltext
        });
    }).catch( err => {
        console.log(err);
        return res.sendStatus(400);
    });
    // res.render('template.ejs', {
    //     pathtem: config.paths.pathtem,
    //     pathfile: config.paths.pathfile,
    //     sqltext: config.paths.sqltext
    // });
};

// Выполнить
exports.posttemplate = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const pathtem = req.body.pathtem;
    const pathfile = req.body.pathfile;
    const sqltext = req.body.sqltext;

    config.paths.pathtem = pathtem;
    config.paths.pathfile = pathfile;
    config.paths.sqltext = sqltext;
    fs.writeFileSync('config.ini', ini.stringify(config, { section: '' }));

    Template.template(pathtem, pathfile, sqltext);

    res.redirect('/template');
};
