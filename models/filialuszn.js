// Определяем объект Sequelize
const Sequelize = require('sequelize');
const fs = require('fs');
const ini = require('ini');

const config = ini.parse(fs.readFileSync('config.ini', 'utf-8'));
const sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, {
    dialect: config.database.dialect,
    host: config.database.server,
    define: { timestamps: false, freezeTableName: true }
});

const FilialUSZN = sequelize.define('zz_filialsUSZN', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    filial: {
        type: Sequelize.STRING,
        allowNull: true
    },
    town: {
        type: Sequelize.STRING,
        allowNull: true
    },
    server: {
        type: Sequelize.STRING,
        allowNull: true
    },
    db: {
        type: Sequelize.STRING,
        allowNull: true
    },
    fileuszn: {
        type: Sequelize.STRING,
        allowNull: true
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    check: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    port: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
});

module.exports = FilialUSZN;
