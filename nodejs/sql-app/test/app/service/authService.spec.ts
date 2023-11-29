import { expect } from 'chai';
import 'mocha';
import sinon from 'sinon';
import { AuthService } from '../../../src/app/services/authService';
import { UserRepository } from '../../../src/domain/interfaces/userRepository';
import { RedisCacheService } from '../../../src/infrastructure/cache/cache';
import { Encrypt } from '../../../src/app/utils/encrypt';
import { UserRepositoryImpl } from '../../../src/infrastructure/repositories/userRepositoryImpl';
import { EncryptImpl } from '../../../src/infrastructure/utils/encrypt.jwt';
import { User } from '../../../src/domain/models/user';
import { UserService } from '../../../src/app/services/userService';
import { UserController } from '../../../src/api/controllers/userController';
import { IUserEntity } from '../../../src/domain/entities/IUserEntity';
//const faker = require("faker");
import bcrypt from "bcrypt";
import logger from '../../../src/infrastructure/logger/logger';
import { json } from 'stream/consumers';



describe('AuthService', () => {
    let authService: AuthService;
    let userRepositoryMock: sinon.SinonStubbedInstance<UserRepository>;
    let redisCacheServiceMock: sinon.SinonStubbedInstance<RedisCacheService>;
    let encryptMock: sinon.SinonStubbedInstance<Encrypt>;

    beforeEach(() => {
        userRepositoryMock = sinon.createStubInstance(UserRepositoryImpl);
        redisCacheServiceMock = sinon.createStubInstance(RedisCacheService);
        encryptMock = sinon.createStubInstance(EncryptImpl);
        authService = new AuthService(userRepositoryMock, encryptMock, redisCacheServiceMock);
        
    });

    afterEach(() => {
        sinon.restore();
    });

    it('debe lanzar un error si el usuario no existe', async () => {
        userRepositoryMock.findByEmail.resolves(null); //tiene que devolver nulo, simula que fue a la bas de datos  devuelve 1
        try {
            await authService.login({ email: 'test@example.com', password: 'password' });
            expect.fail('El servicio no lanzó un error');
        } catch (error) {
            const err = error as Error;
            expect(err.message).to.equal('El email o el password son incorrectos'); // si son iguales significa que esta correcto
        }
    });

    it('Login Exitoso', async () => {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('password', salt);
        const createDate = new Date();
        const userMock:User = {
            id: "1",
            username: 'Luis Paricollo',
            email: 'test@example.com',
            passwordHash: hash,
            createdAt: createDate,
            lastLogin: createDate,
            role: null 
          };
          
        userRepositoryMock.findByEmail.resolves(userMock); //encuentra por email un usuario "creado" 
        encryptMock.encrypt.resolves("tokenSimulado")
        userMock.token='tokenSimulado'
        userRepositoryMock.updateUser.resolves(userMock)
        const userLogged = await authService.login({ email: 'test@example.com', password: 'password' }); //poner todas las constantes del login en await
        delete userLogged.lastLogin;
        

        const userExpected = {
            id: "1",
            username: 'Luis Paricollo',
            email: 'test@example.com',
            token: "tokenSimulado"
        }
        logger.info(JSON.stringify(userLogged))
        logger.info(JSON.stringify(userExpected))

        expect(userLogged).to.eql(userExpected); // si son iguales significa que esta correcto
    });

    it('Login fallido contraseña incorrecta', async () => {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('password', salt);
        const createDate = new Date();
        const userMock:User = {
            id: "1",
            username: 'Luis Paricollo',
            email: 'test@example.com',
            passwordHash: hash,
            createdAt: createDate,
            lastLogin: createDate,
            role: null 
          };
          
        userRepositoryMock.findByEmail.resolves(userMock); //tiene que devolver nulo, simula que fue a la bas de datos  devuelve 1
        encryptMock.encrypt.resolves("tokenSimulado")
        userMock.token='tokenSimulado'
        userRepositoryMock.updateUser.resolves(userMock)
        try {
            await authService.login({ email: 'test@example.com', password: 'pasfdsdfssword' });
            expect.fail('El servicio no lanzó un error');
        } catch (error) {
            const err = error as Error;
            logger.info(err.message)
            expect(err.message).to.equal('El email o la contraseña son incorrectos'); // si son iguales significa que esta correcto
        }
        
    });
});