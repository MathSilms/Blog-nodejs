const Sequelize = require('sequelize');
const connecttion = require('../database/database');
const Category = require('../M-Categories/Category');


const Article = connecttion.define('articles', {
    title:{
        type: Sequelize.STRING,
        allowNull:false
    },
    slug:{
        type:Sequelize.STRING,
        allowNull:false
    },
    body:{
        type:Sequelize.TEXT,
        allowNull:false
    }
});

// relationship

Category.hasMany(Article);
Article.belongsTo(Category);


module.exports = Article;