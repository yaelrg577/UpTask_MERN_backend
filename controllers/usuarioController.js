import Usuario from "../models/Usuario.js"
import generarId from "../helpers/generarid.js"
import generarJWT from "../helpers/generarJWT.js"
import {emailRegistro, emailOlvidePassword} from "../helpers/email.js"

const registrar = async (req, res) => {

    //evitar usuarios duplicados

    const {email} = req.body
    const existeUsuario = await Usuario.findOne({email})

    if(existeUsuario){
        const error = new Error('usuario ya registrado')
        return res.status(400).json({msg: error.message})
    }

    try {
        const usuario = new Usuario(req.body)
        usuario.token = generarId()
        await usuario.save()    
        
        //enviar el email de confirmacion 
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token,
        })

        res.json({msg: 'usuario creado correctamente, Revisa tu email para confirmar tu cuenta'})
    } catch (error) {
        console.log(error)
    }

}

const autenticar = async (req, res) => {
    const {email, password} = req.body
    // comprobar si el usaurio existe 
    const usuario = await Usuario.findOne({email})
    if(!usuario){
        const error = new Error('el usuario no existe')
        return res.status(404).json({msg: error.message})
    }
    //comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada')
        return res.status(403).json({msg: error.message})
    }

    //comprobar su password 
    if( await usuario.comprobarPassword(password)){
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id),
        })
    }else{
        const error = new Error('el password es incorrecto')
        return res.status(403).json({msg: error.message})
    }

}

const confirmar = async (req, res) => {
    const {token} = req.params
    const usuarioConfirmar = await Usuario.findOne({token})
    if(!usuarioConfirmar){
        const error = new Error('token no valido')
        return res.status(403).json({msg: error.message})
    }
    

    try {

        usuarioConfirmar.confirmado = true
        usuarioConfirmar.token = ""
        await usuarioConfirmar.save() 
        res.json({msg: 'Usuario Confirmado Correctamente'})
    } catch (error) {
        console.log(error)
    }

}

const olvidePassword = async (req,res) => {
    const {email} = req.body

    const usuario = await Usuario.findOne({email})
    if(!usuario){
        const error = new Error('el usuario no existe')
        return res.status(404).json({msg: error.message})
    }

    try {
        usuario.token = generarId()
        await usuario.save()

        //enviar email 
        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token,
        })

        res.json({msg: "Hemos enviado un correo con las instrucciones"})
    } catch (error) {
        console.log(error)
    }
}

const comprobarToken = async (req,res) => {
    const {token} = req.params

    const tokenValido = await Usuario.findOne({token})
    
    if(tokenValido){
        res.json({msg: 'Token Valido y el Usuario Existe'})
    }else{
        const error = new Error('Token no Valido')
        return res.status(404).json({msg: error.message})
    }
}

const nuevoPassword = async(req,res) => {
    const {password} = req.body
    const {token} = req.params
    const usuario = await Usuario.findOne({token})

    if(usuario){
        usuario.password = password
        usuario.token = ""
        try {
            await usuario.save()
            res.json({ msg: 'Password Modificado'})
        } catch (error) {
           console.log(error) 
        }
    }else{
        const error = new Error('Token no Valido')
        return res.status(404).json({msg: error.message})
    }

}

const perfil = async (req, res) => {
    const {usuario} = req

    res.json(usuario)
}


export{ 
    registrar,
    autenticar, 
    confirmar,
    olvidePassword,
    comprobarToken, 
    nuevoPassword,
    perfil
}