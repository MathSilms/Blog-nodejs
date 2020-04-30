const Sequelize = require('sequelize');
const connecttion = require('../database/database');

const Category = connecttion.define('categories', {
    title:{
        type: Sequelize.STRING,
        allowNull:false
    },
    slug:{
        type:Sequelize.STRING,
        allowNull:false
    }
});



module.exports = Category;