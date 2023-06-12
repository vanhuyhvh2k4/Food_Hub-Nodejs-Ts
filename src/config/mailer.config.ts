import 'dotenv/config';

interface envConfig {
    MAILER: string;
    HOST: string;
    PORT: number;
    SERVICE: string;
    USERNAME: string;
    PASSWORD: string;
    FROM_ADDRESS: string;
}

const mailConfig: envConfig = {
    MAILER: process.env.MAILER!,
    HOST: process.env.HOST_MAIL!,
    PORT: parseInt(process.env.PORT_MAIL!),
    SERVICE: process.env.SERVICE!,
    USERNAME: process.env.USERNAME_MAIL!,
    PASSWORD: process.env.PASSWORD_MAIL!,
    FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS!
}

export default mailConfig;
