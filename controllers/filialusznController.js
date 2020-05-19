const FilialUSZN = require('../models/filialuszn.js');
const Directory = require('../models/directory.js')

// Получение данных
exports.getfilialsUSZN = function(req, res) {
    FilialUSZN.findAll({ raw: true })
    .then( data => {
        res.render('filialuszn.ejs', {
            filialsUSZN: data
        });
    })
    .catch( err => {
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
    const serverUSZN = req.body.server;
    const dbUSZN = req.body.db;
    const fileparamUSZN = req.body.fileuszn;
    const statusUSZN = req.body.status;
    const portUSZN = req.body.port;
    const filenameUSZN = req.body.filename;
    const emailUSZN = req.body.email;
    FilialUSZN
    .create({ filial: filialUSZN, town: townUSZN, server: serverUSZN, db: dbUSZN, fileuszn: fileparamUSZN, status: statusUSZN, port: portUSZN, filename: filenameUSZN, email: emailUSZN })
    .then(() => {
        res.redirect('/filialuszn');
    })
    .catch(err => console.log(err));
};

// Получаем объект по id для редактирования
exports.editfilialUSZN = function(req, res) {
    const idUSZN = req.params.id;
    FilialUSZN.findAll({ where: {id: idUSZN}, raw: true })
    .then(data => {
        res.render('edit.ejs', {
            filialsUSZN: data[0]
        });
    })
    .catch(err => console.log(err));
};

// Обновление данных в БД
exports.updatefilialUSZN = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const idUSZN = req.body.id;
    const filialUSZN = req.body.filial;
    const townUSZN = req.body.town;
    const serverUSZN = req.body.server;
    const dbUSZN = req.body.db;
    const fileparamUSZN = req.body.fileuszn;
    const statusUSZN = req.body.status;
    const portUSZN = req.body.port;
    const filenameUSZN = req.body.filename;
    const emailUSZN = req.body.email; 
    FilialUSZN
    .update({ filial: filialUSZN, town: townUSZN, server: serverUSZN, db: dbUSZN, fileuszn: fileparamUSZN, status: statusUSZN, port: portUSZN, filename: filenameUSZN, email: emailUSZN }, {where: {id: idUSZN} })
    .then(() => {
        res.redirect('/filialuszn');
    })
    .catch(err => console.log(err));
};

// Удаление данных
exports.deletefilialUSZN = function(req, res){
    const idUSZN = req.params.id;
    FilialUSZN
    .destroy({where: {id: idUSZN} }).then(() => {
        res.redirect('/filialuszn');
    })
    .catch(err => console.log(err));
};

// Получении каталоги
exports.postDirectory = async function (req, res) {
    await Directory.directory(FilialUSZN);
    FilialUSZN.findAll({ raw: true })
    .then(() => {
        res.redirect('/filialuszn');
    })
    .catch(err => {
        console.log(err);
        return res.sendStatus(400);
    });
};

// Все архивы распаковать
exports.postUnarchive = async function (req, res) {
    await Directory.directory(FilialUSZN);
    await Directory.unarchive();   
    FilialUSZN.findAll({ raw: true })
    .then(() => {
        res.redirect('/filialuszn');
    })
    .catch(err => {
        console.log(err);
        return res.sendStatus(400);
    });
};

// Все архивы сжать
exports.postArchive = async function (req, res) {
    await Directory.directory(FilialUSZN);
    await Directory.archive();   
    FilialUSZN.findAll({ raw: true })
    .then(() => {
        res.redirect('/filialuszn');
    })
    .catch(err => {
        console.log(err);
        return res.sendStatus(400);
    });
};

// Все DBF-файлы удалить
exports.postDBFdelete = async function (req, res) {
    await Directory.directory(FilialUSZN);
    await Directory.dbfDelete();  
    FilialUSZN.findAll({ raw: true })
    .then(() => {
        res.redirect('/filialuszn');
    })
    .catch(err => {
        console.log(err);
        return res.sendStatus(400);
    });
};