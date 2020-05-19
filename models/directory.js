const fs = require('fs');
const path = require('path');
const os = require('os');
const _7z = require('7zip-min');

const directory = (filUSZN) => {
    var year = new Date().toISOString().split('-')[0];
    var month = new Date().toISOString().split('-')[1];
    var sys = new os.userInfo().homedir;
    var dirm = sys + '\\Downloads\\' + year + '-' + month;

    // Создать папку по месяцу
    if (!fs.existsSync(dirm)) {
        fs.mkdirSync(dirm);
        console.log('Каталог создать: "' + dirm + '"');
    };

    var dirIn = [];
    var dirOut = [];
    let dirDbfdel = [];
    // Создать папку по филиалам
    filUSZN.findAndCountAll().then(result => {
        for (i in result.rows) {
            var idUSZN = result.rows[i].dataValues.id;
            var dirf = result.rows[i].dataValues.town;
            var dir = dirm + '/' + dirf + ' -';

            // Поиск папку по филиалам
            var b = false;
            var dirA = fs.readdirSync(dirm);                
            var dirB = [];
            for (j in dirA) {
                if (dirA[j].toString().indexOf(dirf) != -1) {
                    var b = true;
                    dirB.push(dirm + '\\' + dirA[j]);
                };                
            };

            if (!b) {
                fs.mkdirSync(dir);
                console.log('Каталог создать: "' + dirf + '"');

                // Статус по папке - 1. Папка без TicketID
                filUSZN
                .update({ status: 1, filename: null }, {where: {id: idUSZN} })
                .catch(err => console.log(err.message));
            } 
            else {
                var statusUSZN = result.rows[i].dataValues.status;
                var dirC = fs.readdirSync(dirB[0]);
                for (k in dirC) {
                    // Статус по папке - 5. Экпорт с архивом 
                    if ((path.extname(dirC[k]).toLowerCase() === '.7z' || path.extname(dirC[k]).toLowerCase() === '.zip' || path.extname(dirC[k]).toLowerCase() === '.rar') && path.basename(dirC[k]).toUpperCase()[0] === 'O') {
                        var statusUSZN = 5;
                    }
                    // Список удалить DBF-файлов
                    else if (path.extname(dirC[k]).toUpperCase() === '.DBF' && statusUSZN === 5) {
                        dirDbfdel.push(dirB[0] + '\\' + dirC[k]);
                    }
                    // Статус по папке - 4. Эскпорт с файлом
                    else if (path.extname(dirC[k]).toUpperCase() === '.DBF' && path.basename(dirC[k]).toUpperCase()[0] === 'O' && statusUSZN !== 5) {
                        var statusUSZN = 4;
                        dirOut.push(dirB[0] + '\\' + dirC[k]);
                    }                   
                    // Статус по папке - 3. Импорт с файлом
                    else if (path.extname(dirC[k]).toUpperCase() === '.DBF' && path.basename(dirC[k]).toUpperCase()[0] === 'Z' && statusUSZN !== 4 && statusUSZN !== 5) {
                        var statusUSZN = 3;
                    }
                    // Статус по папке - 2. Импорт с архивом
                    else if ((path.extname(dirC[k]).toLowerCase() === '.7z' || path.extname(dirC[k]).toLowerCase() === '.zip' || path.extname(dirC[k]).toLowerCase() === '.rar') && path.basename(dirC[k]).toUpperCase()[0] !== 'O') {
                        if (statusUSZN === 1) {
                            var statusUSZN = 2;
                        };
                        dirIn.push(dirB[0] + '\\' + dirC[k]);
                    }
                }             
                
                var filenameUSZN = dirC.join(', ');
                filUSZN
                .update({ status: statusUSZN, filename: filenameUSZN }, {where: {id: idUSZN} })
                .catch(err => console.error(err));
            };
        };

        // console.log(dirIn.join('\n'));
        
        fs.writeFileSync('./temp/filesunarc.txt', dirIn.join('\n'));
        fs.writeFileSync('./temp/filesarc.txt', dirOut.join('\n'));
        fs.writeFileSync('./temp/filesdbfdel.txt', dirDbfdel.join('\n'));
    });
};

const unarchive = () => {
    let dirIn = fs.readFileSync('./temp/filesunarc.txt').toString().split('\n');
    for (i in dirIn) {
        let dirOut = path.dirname(dirIn[i]);
        _7z.unpack(dirIn[i], dirOut, err => console.error(err));
    }
};

const archive = () => {
    let dirOut = fs.readFileSync('./temp/filesarc.txt').toString().split('\n');
    for (i in dirOut) {
        _7z.pack(dirOut[i], path.dirname(dirOut[i])+'\\'+path.basename(dirOut[i], path.extname(dirOut[i]))+'.7z', err => console.error(err));
    }
};

const dbfDelete = () => {
    try {
        let dirDbfdel = fs.readFileSync('./temp/filesdbfdel.txt').toString().split('\n');
        if (dirDbfdel.count !== 0) {
            for (i in dirDbfdel) {
                fs.unlinkSync(dirDbfdel[i]);
            }
        }
    }
    catch {
        err => console.error(err)
    }
};

module.exports = {
    directory: directory,
    unarchive: unarchive,
    archive: archive,
    dbfDelete: dbfDelete
}

// new Date().getDate()          // Get the day as a number (1-31)
// new Date().getDay()           // Get the weekday as a number (1-7)
// new Date().getMonth()         // Get the month (0-11)
// new Date().getFullYear()      // Get the four digit year (yyyy)
// new Date().getHours()         // Get the hour (0-23)
// new Date().getMinutes()       // Get the minutes (0-59)
// new Date().getSeconds()       // Get the seconds (0-59)
// new Date().getMilliseconds()  // Get the milliseconds (0-999)
// new Date().getTime()          // Get the time (milliseconds since January 1, 1970)