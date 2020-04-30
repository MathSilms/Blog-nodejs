const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/categories/new',adminAuth,(req, res)=>{
    res.render('admin/categories/new');
});

router.get('/admin/categories',adminAuth, (req, res )=>{

    Category.findAll().then(cat =>{

        res.render('admin/categories',{cat});
    });


});

router.post('/categories/save', (req, res) =>{
    const title = req.body.title;
    if(title != undefined){
        Category.create({
            title,
            slug:slugify(title)
        }).then(() =>{
            res.redirect('/');
        })

    }else{
        res.redirect('/admin/categories/new')
    }
});

router.post('/categories/delete', (req, res) =>{
    const id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){

            Category.destroy({
                where:{
                    id:id
                }
            }).then(()=>{
                res.redirect('/admin/categories')
            });

        }else{
            res.redirect('/admin/categories')

        }
    }else{
        res.redirect('/admin/categories')

    }
});

router.post('/categories/update', (req, res)=>{
    const id = req.body.id;
    const title = req.body.title;

    Category.update({title:title, slug: slugify(title) },{
        where: {
            id:id
        }
    }).then(()=>{
        res.redirect('/admin/categories');
    });
});

router.get('/admin/categories/edit/:id',adminAuth, (req, res)=>{
    const id = req.params.id;
    if(isNaN(id)){
        res.redirect('/admin/categories')
    }

    Category.findByPk(id).then((cat)=>{
        if(cat !=undefined){
            res.render('admin/categories/edit',{cat})
        }else{
            res.redirect('admin/categories')
        }
    }).catch(err =>{
        res.redirect('/admin/categories')
    })
})
module.exports = router;