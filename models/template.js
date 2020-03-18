var XlsxTemplate = require('xlsx-template');
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const ini = require('ini');

const config = ini.parse(fs.readFileSync('config.ini', 'utf-8'));
const sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, {
    dialect: config.database.dialect,
    host: config.database.server,
    define: { timestamps: false, freezeTableName: true }
});

const template = function(pathtem, pathfile, sqltext) {
    sequelize.query(sqltext, { type: sequelize.QueryTypes.SELECT })
    .then(qry => {
        // Загрузите файл XLSX в память
        fs.readFile(pathtem, function(err, data) {
            if (err) throw err;
            // Создать шаблон
            var xlsxtemplate = new XlsxTemplate(data);

            // Замены происходят на первом листе
            var sheetNumber = 1;

            // Установите некоторые значения заполнителей, соответствующие заполнителям в шаблоне
            var values = {
                extractDate: new Date(),
                // dates: [ new Date("2013-06-01"), new Date("2013-06-02"), new Date("2013-06-03") ],
                q_data: qry
            };

            // Выполнить замену
            xlsxtemplate.substitute(sheetNumber, values);

            // Получить двоичные данные
            var data = xlsxtemplate.generate({type: 'nodebuffer'});
            // console.log(data);

            // ...
            fs.writeFile(pathfile, data, (err) => {
                if (err) throw err;
                console.log('Сохранил!');
            });
        });
    })
    .catch(err => console.log(err.message))

    return
}

module.exports = {
    template: template
}
