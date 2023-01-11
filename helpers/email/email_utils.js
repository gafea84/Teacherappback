const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2     = google.auth.OAuth2;
const { Mutex }  = require('async-mutex');

const { remove, getById } = require('../../models/emailspendientes.model');

const emailEnabled = ((process.env.EMAIL_ENABLED) && (process.env.EMAIL_ENABLED !== '0'));

const createSmtpTransport = async () => {
    const oauth2Client = new OAuth2(
        process.env.EMAIL_CLIENT_ID,
        process.env.EMAIL_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.EMAIL_REFRESH_TOKEN
    });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if (err) {
                console.log(err);
                reject("Failed to create access token :(");
            }
            resolve(token);
        });
    });

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL_USER,
            accessToken,
            clientId: process.env.EMAIL_CLIENT_ID,
            clientSecret: process.env.EMAIL_CLIENT_SECRET,
            refreshToken: process.env.EMAIL_REFRESH_TOKEN
        }
    });

    return transport;
}

// La hacemos promesa, para que se envío y se borre estando
// todo en el mutex (para no enviar más de una vez si el 
// timeout de reintento es ridículamente pequeño).
const sendMailPromise = (smtpTransport, mailOptions) => {
    return new Promise( (resolve, reject) => {
        smtpTransport.sendMail(mailOptions, async (error, info) => {
            try {
                if (error) {
                    console.log('Error al enviar el correo electrónico:', error);
                    reject(error);
                } else {
                    resolve();
                }
            } catch(exception){
                reject(exception);
            }
        }); 
    });
}

const emailLock = new Mutex();

const sendMail = async(id, mailOptions) => {
    const release = await emailLock.acquire();
    try {
        if (emailEnabled) {
            // Nos aseguramos de que no se ha borrado por otro lado
            const emailPendiente = await getById(id);
            if (emailPendiente) {
                try {            
                    if (mailOptions === null) {
                        console.log(`Tipo de email desconocido ${emailType}. Se borrará.`);
                        await remove(id);
                    }
                    else {
                        const smtpTransport = await createSmtpTransport();
                        await sendMailPromise(smtpTransport, mailOptions);
                        await remove(id);
                    }
                } catch(exception){
                    console.log('Error al enviar el correo electrónico:', exception);
                }
            }
        }
    } finally {
        release();
    }
}

module.exports= { sendMail };