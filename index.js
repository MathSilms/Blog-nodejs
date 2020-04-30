const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./database/database');
const session = require('express-session');

// controllers import
const categoriesController = require('./M-Categories/categoriesController');
const articleController = require('./M-Articles/articleController');
const userController = require('./M-Users/UserController');

// Models import
const Article = require('./M-Articles/Article');
const Category = require('./M-Categories/Category');
const User = require('./M-Users/User');

const app = express();

// View Engine
app.set('view engine', 'ejs');

// Session
app.use(session({
    secret:'asdapwidjasdf',
    cookie:{
        maxAge:30000000
    }
}))

// Static

app.use(express.static('public'));
// body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Database

connection.authenticate()
    .then( () =>{
        console.log('conexão feita com sucesso!')
    }).catch( (err) =>{
        console.log(err);
    })

// Controllers

app.use('/', categoriesController);
app.use('/', articleController);
app.use('/', userController);

// Routes

app.get('/session', (req, res) =>{
     req.session.treinamento = "formação nodejs",
     req.session.ano = 2019,
     req.session.email = "lerlasdoawjdasld"
     req.session.user = {
         username: 'matheus',
         email:'@ASDAWDASDAW@gmailcom',
         id:10,
     }
     res.send("sessão gerada!");
});

app.get('/reading', (req, res) =>{
        res.json({
            treinamento: req.session.treinamento,
            ano: req.session.ano,
            email: req.session.email,
            user: req.session.user
        })
});

app.get('/', (req, res)=>{
    Article.findAll({
        order:[
            ['id','DESC']
        ],
        limit:4,
    }).then((art) =>{
        Category.findAll().then((cat) =>{
            res.render('index',{art, cat});
        })
    });

    
});

app.get('/:slug', (req, res) =>{
    const slug = req.params.slug;

    Article.findOne({
        where:{
            slug:slug
        }
    }).then((art)=>{
        if(art != undefined){
            Category.findAll().then((cat) =>{
                res.render('article', {art, cat});
            });
        }else{
            res.redirect('/')
        }
    }).catch(err =>{
        res.redirect('/');
    })
})

app.get('/category/:slug', (req, res) =>{
    const slug = req.params.slug
    Category.findOne({
        where:{
            slug:slug
        },
        include:[{
            model: Article
        }]
    }).then(cat =>{
        if(cat != undefined){
            Category.findAll().then(cats =>{
                res.render('index', {art:cat.articles, cat:cats});
            })

        }else{
            res.redirect('/');
        }
    }).catch(err =>{
        res.redirect('/')
    })
});

app.listen(8080, () =>{
    console.log('servidor rodando na porta 8080')
})