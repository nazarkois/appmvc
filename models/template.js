const XlsxTemplate = require('xlsx-template');
const Sequelize = require('sequelize');
const Papa = require('papaparse');
const fs = require('fs');
const encoding = require('encoding');

const delay = ms => {
    return new Promise(r => {
        setTimeout(() => r(), ms)
    })
};

const JSONtoCSV = async function(ArrParams) {
    // Все запросы к всем базы данные
    var ArrTotal = [];
    for (var i in ArrParams) {
        var sequelize = new Sequelize(ArrParams[i].db, ArrParams[i].user, ArrParams[i].pass, {
            dialect: ArrParams[i].dial,
            host: ArrParams[i].server,
            port: ArrParams[i].port,
            dialectOptions: {
                options: { requestTimeout: 300000 }
            },
            logging: false,
            define: { timestamps: false, freezeTableName: true }
        });
        
        await sequelize.query(ArrParams[i].sqltext, { type: sequelize.QueryTypes.SELECT })
        .then(query => {
            for (j in query) {
                ArrTotal.push(query[j]); 
            };
            // console.log(JSON.stringify(ArrTotal));
        })
        .catch(err => console.error(err))
    }   
    await console.log(JSON.stringify(ArrTotal));

    // JSON конвертировать CSV 
    const csv = Papa.unparse(ArrTotal, { delimiter: ';', header: true });
    const result = encoding.convert(csv, 'windows-1251', 'utf-8');
    fs.writeFileSync('./temp/temp.csv', result);
}

const templatexlsx = (pathtem, pathfile) => {
    fs.unlink(pathfile, () => {
        console.log('Удалил файл: ' + pathfile);
    });

    // Загрузите файл XLSX в память
    fs.readFile(pathtem, function(err, data) {
        if (err) throw err;

        // Создать шаблон
        var xlsxtemplate = new XlsxTemplate(data);

        // Замены происходят на первом листе
        var sheetNumber = 1;

        // Разобрать строку CSV
        (async function read() {
            try {
                var rdata = fs.readFileSync('./temp/temp.csv', 'utf8');
                var json = Papa.parse(rdata, {delimiter: "|", header: true});

                // Установите некоторые значения заполнителей, соответствующие заполнителям в шаблоне
                var values = {
                    extractDate: Date(),
                    // dates: [ new Date("2013-06-01"), new Date("2013-06-02"), new Date("2013-06-03") ],
                    q_data: json.data
                };

                // Выполнить замену
                xlsxtemplate.substitute(sheetNumber, values);

                // Получить двоичные данные
                var fdata = await xlsxtemplate.generate({type: 'nodebuffer'});

                // ...
                await fs.writeFile(pathfile, fdata);
                console.log('Все данные в Excel сохранил!');
            }
            catch (err) {
                console.error(err);
            }
        })();
    });
}

module.exports = {
    delay: delay,
    JSONtoCSV: JSONtoCSV,
    templatexlsx: templatexlsx
}