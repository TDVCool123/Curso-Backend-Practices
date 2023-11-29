import express, { Request, Response } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import logger from './infrastructure/logger/logger';
import { env } from './infrastructure/config/config';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './api/swagger/swaggerConfig';

import { AppDataSource } from "./infrastructure/config/dataSource";
import { UserService } from './app/services/userService';
import { UserRepositoryImpl } from './infrastructure/repositories/userRepositoryImpl';
import { UserController } from './api/controllers/userController';
import { RoleRepositoryImpl } from './infrastructure/repositories/roleRepositoryImpl';
import { RoleService } from './app/services/roleService';
import { RoleController } from './api/controllers/roleController';
import { AuthController } from './api/controllers/authController';
import { AuthService } from './app/services/authService';
import { apiRoutes } from './api/controllers/apiRoutes';
import { limiter } from './api/middleware/rateLimiter';

AppDataSource.initialize().then(() => {
    const app = express();
    dotenv.config();

    const PORT = env.port;

    app.use(express.json()); //para poder llamar al body

    // Setup Logger 
    app.use(morgan('combined', { stream: { write: (message: string) => logger.info(message.trim()) } }));

    app.get('/', (req: Request, res: Response) => {
        res.send('Servidor Up');
    });

    // Ruta para Swagger UI
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    //setup Limiter
    app.use(limiter);    

    app.use('/api', apiRoutes());
  

    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
}).catch(error => console.log(error));
