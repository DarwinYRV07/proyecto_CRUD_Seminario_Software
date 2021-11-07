import mysql from "mysql2";

const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
})

conexion.connect( (err) => {
    if(err){
        console.log(`${err}`);
        return
    }
    console.log(`Conexion Exitosamente USUARIO ${process.env.DB_USERNAME}`)
    console.log(`Conexion Exitosamente BASE DE DATO${process.env.DB_DATABASE}`)
})

export default conexion; 