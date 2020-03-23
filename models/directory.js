const fs = require('fs');
const path = require('path');
const find = require('find');
const os = require('os');

const directory = filUSZN => {
    var year = new Date().toISOString().split('-')[0];
    var month = new Date().toISOString().split('-')[1];
    var sys = new os.userInfo().homedir;
    var dirm = sys + '/Downloads/' + year + '-' + month;

    // Создать папку по месяцу
    if (!fs.existsSync(dirm)) {
        fs.mkdirSync(dirm);
        console.log('Каталог создать: "' + dirm + '"');
    }

    // Создать папку по филиалам
    filUSZN.findAndCountAll().then(result => {
        for (var i = 0; i < result.count; i++) {
            var dirf = result.rows[i].dataValues.town;
            var dir = dirm + '/' + dirf + ' -';

            // Поиск папку по филиалам
            var b = false;
            var dirA = find.dirSync(dirm);
            for (var j = 0; j < dirA.length; j++) {
                if (dirA[j].toString().indexOf(dirf)!=-1) {
                    var b = true;
                };
            };

            if (!b) {
                fs.mkdirSync(dir);
                console.log('Каталог создать: "' + dirf + '"');

                // Статус по папке - 1. Папка без TicketID
                var idUSZN = result.rows[i].dataValues.id;
                filUSZN.update({ status: 1 }, {where: {id: idUSZN} })
                .catch(err => console.log(err.message));
            }
            else {
                console.log('Каталог есть: "' + dirf + '"');
            };
        };
    });
    return
};

module.exports = {
    directory: directory
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
