import bcryptjs from 'bcryptjs';
import  jwt  from 'jsonwebtoken';
import {promisify} from 'util';
import con from '../database/connection_db.js';

var session
//!/**--------------------------------------Parte de registo----------------------------------------------- */
export const register = async (req,res) =>{
    const {fullname, username,password} = req.body;
    console.log(req.body);
    // if(!fullname && !username && !password){
    //     console.log("DEBE DE LLENAR LOS DATOS DE REGISTRO");
    //     res.render('/register');
    // }else{
        const hash = await bcryptjs.hash(password, 8)
    //console.log(password,hash);
        const data ={
            username:username,
            password:hash,
            fullname:fullname,
        }

        con.query('INSERT INTO users SET ?',[data],(err,result)=>{
            if(err){
                console.log("Ocurrio un error al insertar el registro")
                return
            }
            res.redirect('/');
        })
   // }

}
/**-------------------------------------------------------------------------------------------------- */
//!/*------------------------------------LOGIN-------------------------------------------------------------- */
export const login = (req,res)=>{
    const {username, password} = req.body;

    if(!username || !password){
        res.render('login')
        return;
    }

    con.query('SELECT * FROM users WHERE username = ?',[username], async (err,result) => {
       // console.log(result[0].password)

        if(result.length === 0 || !(await bcryptjs.compare(password, result[0].password))){
            res.render('login')
            return
        }

        //! TOKEN LO CREO AQUI EL ERROR??
        const id = result[0].id;
        const token = jwt.sign({id: id}, process.env.JWT_SECRET);
        session = req.session;
        session.token = token;

        console.log(`SECCION DE LOGIN: ${session}`);

        res.redirect('/')
    })

    
}

//!/**---------------------------------LOGOUT----------------------------------------------------------------- */

export const logout = (req, res) => {
    req.session.destroy()
    res.redirect('/login')
}

/**-------------------------------------------------------------------------------------------------- */
//!/**-------------------------------AUTENTIFICACION------------------------------------------------------------------- */
export const isAuthenticated = async (req, res, next) => {
    if (req.session.token) {
        const verifyPromise = await promisify(jwt.verify)
        const decoded = await verifyPromise(req.session.token, process.env.JWT_SECRET)
        const userID = decoded.id
        
        con.query('SELECT * FROM users WHERE id = ?', [userID], (err, result) => {
            if (err) {
                return res.redirect('/login')
            }

            if (result.length === 0) {
                return res.redirect('/login')
            }
            
            session = req.session
            session.user = result[0]
            next()
        }) 
    }
    else {
        return res.redirect('/login')
    }
}

//!/**------------------------------LOGGER-------------------------------------------------------------------- */
export const logger = (req, res, next) => {
    console.log(req.path, req.method)
    next()
}
/**-------------------------------------------------------------------------------------------------- */

//!/**-------------------------------PRODUCTOS------------------------------------------------------------------- */
export const nuevoproducto = (req,res)=>{
    const {nombreproducto,descripcionproducto,precioproducto,cantidadproducto} = req.body;
    console.log(req.body);
    // if (!nombreproducto && !descripcionproducto && !precioproducto,!cantidadproducto){
    //     //alert("DEBE DE LLENAR TODO LOS VALORES QUE SE LE PIDEN!");
    //     console.log("VALORES VACIOS NO SE PUEDEN");
    //     res.render('/nuevoproducto');
    // }else{
        
        const data ={
            nombreproducto: nombreproducto,
            descripcionproducto: descripcionproducto,
            precioproducto: precioproducto,
            cantidadproducto: cantidadproducto,
        }
    
        con.query("INSERT INTO productos SET ?",[data],(err,result)=>{
            if(err){
                console.log("Ocurrio un error al insertar un nuevo producto")
                return
            }
            res.redirect('/');
        })
    //}
    
}
// export const consultaproducto = (req,res)=>{
//     const l=0;
//     con.query('SELECT * FROM productos',[l],(err,result) => {
//         if(err){
//             console.log("NO SE LOGRO HACER LA CONSULTA DE PRODUCTOS");
//             return;
//         }
//         res.render(result);
//     })
// } 
// export const llamarproductoid = (req,res)=>{
//     const idproducto = req.body.id;
//     con.query('SELECT * FROM productos WHERE id = ?',[idproducto],(err, result) => {
//         if(err){
//             console.log("No se logro traer el producto que sea");
//             return;
//         }
//         res.render(result);
//     })
// }
export const borrarproducto = (req,res)=>{
    const {id} = req.body;
    con.query("DELETE FROM productos WHERE id = ?", [id],(err,result) => {
        if(err){
            console.log('Ocurrio un error al eliminar el producto')
            return
        }
        res.redirect('/');
    })
}
export const editarproducto = (req,res)=>{
    const {id,nombreproducto,descripcionproducto,precioproducto,cantidadproducto} = req.body;
    const data={
        nombreproducto: nombreproducto,
        descripcionproducto: descripcionproducto,
        precioproducto: precioproducto,
        cantidadproducto: cantidadproducto,
    }
    con.query('UDATE categorias SET ? WHERE id = '+id+';',[data],(err,result)=> {
        console.log('Ocurrio un error al editar el producto');
        return
    })
    res.redirect('/');
}


// export const listadocategoria = (req,res)=>{
//     con.query("SELECT * FROM categorias",(err,result)=>{
//         console.log(result[0]);
//     });
// }

/**-------------------------------------------------------------------------------------------------- */
//!/**-------------------------------CATEGORIES------------------------------------------------------------------- */
export const nuevocategoria =  (req,res)=>{
    const {nombrecategoria} = req.body;
    console.log(req.body);
    // if(!nombrecategoria){
    //     console.log("NO DEBEN ESTAR VACIOS")
    // }else{
        const data = {nombrecategoria};
        con.query("INSERT INTO categorias SET ?",[data],(err,result)=>{
            if(err){
                console.log("Ocurrio un error al insertar una nueva categoria")
                return
            }
            res.redirect('/');
    })
   // }
    
}

export const borrarcategoria = (req,res)=>{
    const {id} = req.body;
    con.query("DELETE FROM categorias WHERE id = ?", [id],(err,result) => {
        if(err){
            console.log('Ocurrio un error al eliminar la categoria')
            return
        }
        res.redirect('/');
    })
}
export const editarcategoria = (req,res)=>{
    const {id,nombrecategoria} = req.body;
    con.query('UDATE categorias SET ? WHERE id = '+id+';',[nombrecategoria],(err,result)=> {
        console.log('Ocurrio un error al editar la categoria');
        return
    })
    res.redirect('/');
}



/**-------------------------------------------------------------------------------------------------- */ 

