import 'dotenv/config';

const mailConfig = {
    MAILER: process.env.MAILER,
    HOST: process.env.HOST_MAIL,
    PORT: process.env.PORT_MAIL,
    USERNAME: process.env.USERNAME_MAIL,
    PASSWORD: process.env.PASSWORD_MAIL,
    FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS
}

export default mailConfig;
