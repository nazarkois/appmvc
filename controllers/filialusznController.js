const FilialUSZN = require('../models/filialuszn.js');
const Directory = require('../models/directory.js')

// Получение данных
exports.getfilialsUSZN = function(req, res) {
    FilialUSZN.findAll({ raw: true }).then( data => {
        res.render('filialuszn.ejs', {
            filialsUSZN: data
        });
    }).catch( err => {
        console.log(err);
        return res.sendStatus(400);
    });
};

// Возвращаем форму для добавления данных
exports.addfilialUSZN = function(req, res){
    res.render('create.ejs');
};

// Добавление данных
exports.postfilialUSZN = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const filialUSZN = req.body.filial;
    const townUSZN = req.body.town;
    const server_dbUSZN = req.body.server_db;
    const fileparamUSZN = req.body.fileuszn;
    const statusUSZN = req.body.status;
    FilialUSZN.create({ filial: filialUSZN, town: townUSZN, server_db: server_dbUSZN, fileuszn: fileparamUSZN, status: statusUSZN }).then(() => {
        res.redirect('/filialuszn');
    }).catch(err => console.log(err));
};

// Получаем объект по id для редактирования
exports.editfilialUSZN = function(req, res) {
    const idUSZN = req.params.id;
    FilialUSZN.findAll({ where: {id: idUSZN}, raw: true }).then(data => {
        res.render('edit.ejs', {
            filialsUSZN: data[0]
        });
    }).catch(err => console.log(err));
};

// Обновление данных в БД
exports.updatefilialUSZN = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const idUSZN = req.body.id;
    const filialUSZN = req.body.filial;
    const townUSZN = req.body.town;
    const server_dbUSZN = req.body.server_db;
    const fileparamUSZN = req.body.fileuszn;
    const statusUSZN = req.body.status;
    FilialUSZN.update({ filial: filialUSZN, town: townUSZN, server_db: server_dbUSZN, fileuszn: fileparamUSZN, status: statusUSZN }, {where: {id: idUSZN} }).then(() => {
        res.redirect('/filialuszn');
    }).catch(err => console.log(err));
};

// Удаление данных
exports.deletefilialUSZN = function(req, res){
    const idUSZN = req.params.id;
    FilialUSZN.destroy({where: {id: idUSZN} }).then(() => {
        res.redirect('/filialuszn');
    }).catch(err => console.log(err));
};

// Получении каталоги
exports.postDirectory = function (req, res) {
    Directory.directory(FilialUSZN);
    FilialUSZN.findAll({ raw: true })
    .then(data => {})
    .then(() => {
        res.redirect('/filialuszn');
    })
    .catch(err => {
        console.log(err);
        return res.sendStatus(400);
    });
};
