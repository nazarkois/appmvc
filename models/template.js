const XlsxTemplate = require('xlsx-template');
const Sequelize = require('sequelize');
const Papa = require('papaparse')
const fs = require('fs');
const path = require('path');
const ini = require('ini');

const config = ini.parse(fs.readFileSync('config.ini', 'utf-8'));

const templatefull = async function(sqltext, db, user, pass, dial, host, port, one) {
    const sequelize = new Sequelize(db, user, pass, {
        dialect: dial,
        host: host,
        port: port,
        define: { timestamps: false, freezeTableName: true }
    });

    await sequelize.query(sqltext, { type: sequelize.QueryTypes.SELECT })
    .then(qry => {
        // Конвертировать обратно в CSV
        if (one) {
            (async function write(data) {
                var csv = await Papa.unparse(data, {delimiter: "|"});
                await fs.writeFileSync('./temp/temp.csv', csv);
                console.log('Данные в БД: ' + db + ' сохранил!');
            })(qry);
        }
        else {
            (async function append(data) {
                var csv = await Papa.unparse(data, {delimiter: "|", header: false});
                await fs.appendFileSync('./temp/temp.csv', '\r\n'+csv);
                console.log('Данные в БД: ' + db + ' сохранил!');
            })(qry);
        };
    })
    .catch(err => console.log(err.message))
}

const templatexlsx = async (pathtem, pathfile) => {
    // Загрузите файл XLSX в память
    await fs.readFile(pathtem, function(err, data) {
        if (err) throw err;

        // Создать шаблон
        var xlsxtemplate = new XlsxTemplate(data);

        // Замены происходят на первом листе
        var sheetNumber = 1;

        // Разобрать строку CSV
        (async function read() {
            await fs.readFile('./temp/temp.csv', 'utf8', function(err, rdata) {
                if (err) throw err;

                var json = Papa.parse(rdata, {delimiter: "|", header: true});

                // Установите некоторые значения заполнителей, соответствующие заполнителям в шаблоне
                var values = {
                    extractDate: new Date(),
                    // dates: [ new Date("2013-06-01"), new Date("2013-06-02"), new Date("2013-06-03") ],
                    q_data: json.data
                };

                // Выполнить замену
                xlsxtemplate.substitute(sheetNumber, values);

                // Получить двоичные данные
                var data = xlsxtemplate.generate({type: 'nodebuffer'});

                // ...
                fs.writeFile(pathfile, data, (err) => {
                    if (err) throw err.message;
                });
                console.log('Все данные в Excel сохранил!');
            });

            await fs.close('./temp/temp.csv', (err) => {
                if (err) throw err.message;
            });
        })();
    });

    await fs.close(pathfile, (err) => {
        if (err) throw err.message;
    });
}

module.exports = {
    templatefull: templatefull,
    templatexlsx: templatexlsx
}
