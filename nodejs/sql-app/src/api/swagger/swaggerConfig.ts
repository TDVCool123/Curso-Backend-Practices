import swaggerJsdoc from 'swagger-jsdoc';
import { swagger } from '../../infrastructure/config/config';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: swagger.tittle,
        version: swagger.version,
        description: swagger.description,
    },
    servers: [
        {
            url: 'http://localhost:3000/api',
            description: 'Servidor de Desarrollo',
        },  {
            url: 'https://facebooke.com',
            description: 'Servidor de Desarrollo',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./src/api/controllers/*.ts', './src/api/swagger/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
