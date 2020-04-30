const Sequelize = require('sequelize');

const connection = new Sequelize('guiapress','root','0139Sm12Dc',{
    host:'localhost',
    dialect: 'mysql',
    timezone:'-03:00'
});

module.exports = connection;