const Sequelize = require('sequelize');
const connecttion = require('../database/database');

const User = connecttion.define('users', {
    email:{
        type: Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

User.sync({force:false});

module.exports = User;