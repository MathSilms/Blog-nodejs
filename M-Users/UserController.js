const express = require('express');
const User = require('./User');
const bcrypt = require('bcryptjs');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/users',adminAuth, (req, res) =>{

    User.findAll().then(users =>{
        res.render('admin/users/index', {users})
    })
});

router.get('/admin/users/create',adminAuth, (req, res )=>{
    res.render('admin/users/create');
});

router.post('/users/create', (req, res )=>{
    const email = req.body.email;
    const password = req.body.password;
    

    User.findOne({where:{email}}).then(user =>{

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        
        if(user == undefined){
            User.create({
                email,
                password:hash,
            }).then(() =>{
                res.redirect('/');
            }).catch(err =>{
                console.log(err);
                res.redirect('/');
            });
        }else{
            res.redirect('/admin/users/create')
        }
    })

    
});

router.get('/login', (req, res )=>{
    res.render('admin/users/login');
});

router.post('/authenticate',  (req, res )=>{
    const email = req.body.email
    const password = req.body.password
    
    User.findOne({where:{email:email}}).then( user =>{
        console.log(user)
        if(user != undefined){
            const correct = bcrypt.compareSync(password, user.password);

            if(correct){
                req.session.user = {
                    id: user.id,
                    email:user.email
                }

                res.json(req.session.user);
            }else{
                res.redirect('/login');
            }
        }else{
            res.redirect('/login')
        }
    })

    res.render('admin/users/login');
});

router.get('/logout', (req,res )=>{
    req.session.user = undefined;
    res.redirect('/');
});

module.exports = router;