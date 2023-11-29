import bcrypt from "bcrypt";
import logger from "../../infrastructure/logger/logger";

import { UserDto } from "../dtos/user.dto";
import { LoginDTO } from "../dtos/login.dto";

import { User } from "../../domain/models/user";
import { IUserEntity } from "../../domain/entities/IUserEntity";
import { UserRepository } from "../../domain/interfaces/userRepository";
import { EncryptImpl } from "../../infrastructure/utils/encrypt.jwt";
import { ICacheService } from "../../domain/interfaces/cacheRepository";



export class AuthService {
    constructor(private userRepository: UserRepository, private encrypt: EncryptImpl, private redisCacheService: ICacheService) { 
        this.getCache
    }

    async getCache(){ //Crear el metodo getCache para imprimir lo guardado en consola
        const USER_KEY = 'USER'
        const userID = '9e95f28b-b323-44a5-9bac-7a6ea3f8e1d6'
        const ROLE_KEY = "ROLE"
        const roleID = "1234"
        const sol = await this.redisCacheService.get(`${USER_KEY}:${userID}`)
        console.log("🚀 ~ file: authService.ts:23 ~ AuthService ~ getCache ~ sol:", sol)
    }

    async login(loginDTO: LoginDTO): Promise<UserDto> {

        this.getCache();

        const userEntity: Partial<IUserEntity> = {
            email: loginDTO.email,
            passwordHash: loginDTO.password
        };
        const user: User = await this.userRepository.findByEmail(userEntity.email); //guarda en user el email que se proporciono
        console.log("🚀 ~ file: authService.ts:34 ~ AuthService ~ login ~ user:", user)


        if (!user) {
            logger.error(`El usuario con el email: ${userEntity.email} no existe`);
            throw Error('El email o el password son incorrectos');
        }

        // TODO: llevarlo al utils 

        const isPasswordCorrect = await bcrypt.compare(userEntity.passwordHash, user.passwordHash);
        if (!isPasswordCorrect) {
            logger.error(`La contraseña es incorrecta : ${userEntity.passwordHash}`);
            throw Error('El email o la contraseña son incorrectos');
        }

        const token = await this.encrypt.encrypt({ userId: user.id });
        user.token = token;
        user.lastLogin = new Date();

        const userUpdated = await this.userRepository.updateUser(user.id, user);

        // TODO: se deberia modificar el token y tambien el lastlogin
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            lastLogin: user.lastLogin,
            token: user.token
        };
    }
}