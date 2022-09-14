import nodemailer from 'nodemailer'

export const emailRegistro = async (datos) => {
  const {email, nombre, token} = datos

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // informacion del email 
  const info = await transport.sendMail({
    from: '"UpTask - Administrador de proyectos" <cuentas@uptask.com>',
    to: email, 
    subject: "UpTask - comprueba tu cuenta",
    text: "comprueba tu cuenta en UpTask",
    html: `<p> hola: ${nombre} comprueba tu cuenta en UpTask </p>
        <p> tu cuenta ya casi esta lista, solo debes de comprobarla en el siguiente enlace: 
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuentas </a> 
        
        <p> si tu no creaste esta cuenta, puedes ignorar el mensaje </p>
    
    `,
  })
}

export const emailOlvidePassword = async (datos) => {
  const {email, nombre, token} = datos

  //TODO: mover hacia variables de entorno 
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // informacion del email 
  const info = await transport.sendMail({
    from: '"UpTask - Administrador de proyectos" <cuentas@uptask.com>',
    to: email, 
    subject: "UpTask - Restablece tu password",
    text: "Restablece tu Password",
    html: `<p> hola: ${nombre} haz solicitado restablecer tu passsword</p>
        <p>sigue  el siguiente en la enlace para generar tu password:  
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Password</a> 
        
        <p> si solicitastes este email, puedes ignorar el mensaje </p>
    
    `,
  })
}