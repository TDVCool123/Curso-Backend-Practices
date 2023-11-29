/**
 * @swagger
 * components:
 *   schemas:
 *     LoginCredentials:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         username: "usuario_ejemplo"
 *         password: "contraseña123"
 *
 *     getResponse:
 *       type: object
 *       properties:
 *         user:
 *            type: object
 *            properties:
 *              id:
 *                  type: string
 *              username:
 *                  type: string
 *              email:
 *                  type: string
 *              createdAt:
 *                  type: string
 *              lastLogin:
 *                  type: string
 *              token:
 *                  type: string
 *       example:
 *         username: "usuario_ejemplo"
 *         password: "contraseña123"
 *         email: "emailejemplo@gmail.com"
 *         createdAt: "22/11/2023"
 *         lastLogin: "22/11/2023 12:00:25"
 *         token: "sdfadkushbfn654D1D4_D5D"
 * 
 *     createUserCredentials:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         email:
 *           type: string
 *       example:
 *         username: "usuario_ejemplo"
 *         password: "contraseña123"
 *         email: "ejemplo@mail.com"
 * 
 *     createResponse:
 *       type: object
 *       properties:
 *         user:
 *            type: object
 *            properties:
 *              id:
 *                  type: string
 *              username:
 *                  type: string
 *              email:
 *                  type: string
 *              createdAt:
 *                  type: string
 *              lastLogin:
 *                  type: string
 *       example:
 *         username: "usuario_ejemplo"
 *         password: "contraseña123"
 *         email: "emailejemplo@gmail.com"
 *         createdAt: "22/11/2023"
 *         lastLogin: "null"
 * 
 *     updateUserCredentials:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         username: "usuario_ejemplo"
 *         password: "contraseña123"
 * 
 *     updateResponse:
 *       type: object
 *       properties:
 *         user:
 *            type: object
 *            properties:
 *              id:
 *                  type: string
 *              username:
 *                  type: string
 *              email:
 *                  type: string
 *       example:
 *         username: "usuario_ejemplo"
 *         password: "contraseña123"
 *         email: "emailejemplo@gmail.com"
 */
