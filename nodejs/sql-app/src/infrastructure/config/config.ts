import dotenv from 'dotenv';
dotenv.config();

export const env = {
    port: process.env.ENV_PORT || 3000,
    environment: process.env.ENV || 'develop'
};

export const db = {
    port: process.env.BD_PORT || 3306,
    type: process.env.BD_TYPE || 'mysql',
    username: process.env.BD_USER || 'root',
    password: process.env.BD_PASS ||  'root',
    host: process.env.BD_HOST || 'localhost',
    database: process.env.BD_NAME || 'app',
}

export const lg = {
    level: process.env.LG_LEVEL || 'info'
}

export const jwt = {
    secretKey:process.env.JWT_SECRET || 'your_secret_key',
    expirationTime: process.env.JWT_TIME_EXPIRED || '3s'
}

export const redis={
    url:process.env.REDIS_URL || "localhost"
    
}


export const swagger={
tittle:process.env.SWAGGER_TITTLE ||'API de Mi Aplicación',
version:process.env.SWAGGER_VERSION ||' 1.0.0',
description:process.env.SWAGGER_DESCRIPTION || 'Esta es la documentación de mi API'
}