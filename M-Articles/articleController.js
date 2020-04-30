const express = require('express');
const router = express.Router();
const Category = require('../M-Categories/Category')
const Article = require('./Article');
const Slugify= require('slugify');
const adminAuth = require('../middlewares/adminAuth');


router.get('/admin/articles',adminAuth, (req, res )=>{

    Article.findAll({
        include:[{model: Category}]
    }).then((art)=>{
        res.render('admin/articles/index',{art})
    });
});

router.get('/admin/articles/new',adminAuth, (req, res )=>{
    Category.findAll().then(cat =>{
        res.render('admin/articles/new',{cat});
    }) 
});

router.post('/articles/save', (req, res) =>{
    const title= req.body.title;
    const body = req.body.body;
    const id = req.body.category;
    console.log(title, body, id)
    Article.create({
        title:title,
        slug: Slugify(title),
        body,
        categoryId:id
    }).then(()=>{
        res.redirect('/admin/articles');
    })
});

router.post('/articles/delete', (req, res) =>{
    const id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){

            Article.destroy({
                where:{
                    id:id
                }
            }).then(()=>{
                res.redirect('/admin/articles')
            });

        }else{
            res.redirect('/admin/articles')

        }
    }else{
        res.redirect('/admin/articles')

    }
});

router.get('/admin/articles/edit/:id',adminAuth, (req, res)=>{
    const id = req.params.id;
    if(isNaN(id)){
        res.redirect('/admin/articles')
    }

    Article.findByPk(id).then((art)=>{
        if(art != undefined){
            Category.findAll().then((cat) =>{
                res.render('admin/articles/edit',{art, cat})
            });
        }else{
            res.redirect('admin/articles')
        }
    }).catch(err =>{
        console.log(err)
        res.redirect('/')
    })
})

router.post('/articles/update', (req, res)=>{
    const title= req.body.title;
    const body = req.body.body;
    const id = req.body.id;
    const cat = req.body.category

    Article.update({title,categoryId:cat,slug: Slugify(title),body},{
        where: {
            id:id
        }
    }).then(()=>{
        res.redirect('/admin/articles');
    }).catch(err =>{
        console.log(err);
        res.redirect('/');
    })
});

router.get('/articles/page/:num',(req, res)=>{
    let page = req.params.num;
    let offset = 0;

    if(isNaN(page) || page == 1){
        offset=0;
    }else{
        offset = (parseInt(page)-1 ) * 4;
    }

    Article.findAndCountAll({
        limit:4,
        offset: offset,
        order:[
            ['id','DESC']
        ],
    }).then( art =>{
        let next;

        if(offset + 4 >= art.count){
            next = false;
        }else{
            next= true;
        }

      let ress = {
           page: parseInt(page),
           next : next,
           art : art,
        }

        Category.findAll().then(cat =>{
            res.render('admin/articles/page',{cat, ress});

        })

    })
});

module.exports = router;
