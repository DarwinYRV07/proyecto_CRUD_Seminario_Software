import express from 'express';
import {register, login,logout,isAuthenticated,nuevocategoria,nuevoproducto, editarcategoria, editarproducto,borrarcategoria,borrarproducto} from '../controllers/authController.js';
const router = express.Router();

// llamar las tablas de la base de datos

import con from '../database/connection_db.js';
var categorias = [];
var Editarcategoria =[];
var productos = [];
var Editarproducto = [];


//! VISTAS
router.get('/', isAuthenticated, (req, res) => { 
    res.render('index', {user: req.session.user})
    res.render('productos')
})

router.get('/login',(req,res)=>{
    res.render('login');
})

router.get('/logout', logout);

router.get('/register',(req,res)=>{
    res.render('register');
})


///-------------------------------------////////////--------------------------------------------

//!Productos 
router.get('/productos',(req,res)=>{
    con.query("SELECT * FROM productos",async(err,result)=>{
        if(err){
            productos=[];
        }else{
            productos=result;
        } 
    })
    console.log("DATOOOOOOSSS "+ productos);
    res.render('productos',{datos:productos});
})
router.get('/nuevoproducto',(req,res)=>{
    res.render('nuevoproducto',);
})

router.get('/editarproductoid',(req,res)=>{
    res.render('editarproductoid');
})

//!Categorias
router.get('/categorias',(req,res)=>{
    con.query("SELECT * FROM categorias",async(err,result)=>{
        if(err){
            categorias=[];
        }else{
            categorias=result;
        }
    })
    console.log("DATOOOOOOSSS "+ categorias);
    res.render('categorias',{datos:categorias});
})
router.get('/nuevocategoria',(req,res)=>{
    res.render('nuevocategoria');
})

router.get('/editarcategoriaid',(req,res)=>{
    res.render('editarcategoriaid');
})


//!CONTROLES

router.post('/register',register);
router.post('/login',login);


router.post('/nuevoproducto',nuevoproducto);
router.post('/nuevocategoria',nuevocategoria);


router.get('/editarproductoid',editarproducto);
router.get('/editarcategorid',editarcategoria);



export default router;