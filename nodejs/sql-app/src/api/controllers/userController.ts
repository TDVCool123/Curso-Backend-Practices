import { Request, Response, Router } from 'express';
import { UserService } from '../../app/services/userService';
import { UserDto } from '../../app/dtos/user.dto';
import { CreateUserDTO } from '../../app/dtos/create.user.dto';
import logger from '../../infrastructure/logger/logger';
import { userValidationRules, validate } from '../middleware/userValidator';
import { verifyTokenMiddleware } from '../middleware/verifyToken';

export class UserController {
    public router: Router;
    private userService: UserService;


    constructor(userService: UserService) {
        this.userService = userService;
        this.router = Router();
        this.routes();
    }





/**
 * @swagger
 
 * /get:
 *   get:
 *     summary: Conseguir un usuario en sql app
 *     tags: [GetUser] 
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getResponse'
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 *   
 * post:
 *   post:
 *     summary: Conseguir un usuario en sql app
 *     tags: [CreateUser] 
 *     requestBody:
 *       required: True
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createUserCredentials'
 *     responses:
 *       200:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/createResponse'
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 * 
 * put:
 *   put:
 *     summary: Conseguir un usuario en sql app
 *     tags: [updateUser] 
 *     requestBody:
 *       required: True
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateUserCredentials'
 *     responses:
 *       200:
 *         description: Usuario modificado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/updateResponse'
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 * 
 * delete:
 *   delete:
 *     summary: Conseguir un usuario en sql app
 *     tags: [deleteUser] 
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente

 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 */





    public async getUserById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const userDto = await this.userService.getUserById(id);

        if (!userDto) {
            res.status(404).json({ message: 'User not found' });
            return; 
        }

        res.json(userDto);
    }

    public async createUser(req: Request, res: Response): Promise<Response> {
        try {
            const userDto: CreateUserDTO = req.body;
            const user = await this.userService.createUser(userDto);
            return res.status(201).json(user);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                return res.status(400).json({ message: error.message });
            }
            return res.status(400).json({ message: error });

        }
    }

    public async deleteUser(req: Request, res: Response): Promise<Response> {
        const { userId } = req.params;
        try {
            logger.debug(`Intentando eliminar al usuario con ID: ${userId}`);
            await this.userService.deleteUser(userId);
            logger.info(`Usuario con ID: ${userId} eliminado con éxito`);
            return res.status(200).json({ message: 'Usuario eliminado con éxito' });
        } catch (error) {
            logger.error(`Error al eliminar al usuario con ID: ${userId}. Error: ${error}`);
            return res.status(500).json({ message: error });
        }
    }

    public async updateUser(req: Request, res: Response): Promise<Response> {
        const { userId } = req.params;
        const updateData = req.body;
        try {
            logger.debug(`Intentando actualizar al usuario con ID: ${userId}`);
            const updatedUser = await this.userService.updateUser(userId, updateData);
            logger.info(`Usuario con ID: ${userId} actualizado con éxito`);
            return res.status(200).json({ user: updatedUser });
        } catch (error) {
            logger.error(`Error al actualizar al usuario con ID: ${userId}. Error: ${error}`);
            return res.status(500).json({ message: 'Error al actualizar el usuario' });
        }
    };

    public routes() {
        this.router.get('/:id',verifyTokenMiddleware, this.getUserById.bind(this));
        this.router.post('/',userValidationRules(),validate, this.createUser.bind(this));
        this.router.delete('/:userId', this.deleteUser.bind(this));
        this.router.put('/:userId', this.updateUser.bind(this));
    }
}
