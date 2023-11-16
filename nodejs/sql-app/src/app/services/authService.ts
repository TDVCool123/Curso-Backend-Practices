import { IUserEntity } from "../../domain/entities/IUserEntity";
import { UserRepository } from "../../domain/interfaces/userRepository";
import logger from "../../infrastructure/logger/logger";
import { LoginDTO } from "../dtos/login.dto";
import { jwt as jwtConfig } from '../../infrastructure/config/config';
import jwt from 'jsonwebtoken';
import { UserDto } from "../dtos/user.dto";
import { User } from "../../domain/models/user";
import { EncryptImpl } from "../../infrastructure/utils/encrypt.jwt";
import { ICacheService } from "../../domain/interfaces/cacheRepository";
import bcrypt from "bcrypt";



export class AuthService {
    constructor(private userRepository: UserRepository, private encrypt: EncryptImpl, private redisCacheService: ICacheService) { 
        this.getCache
    }

    async getCache(){
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
        const user: User = await this.userRepository.findByEmail(userEntity.email);
        console.log("🚀 ~ file: authService.ts:34 ~ AuthService ~ login ~ user:", user)

        const USER_KEY = 'USER'
        this.redisCacheService.set(`${USER_KEY}:${user.id}`, JSON.stringify(user))

        if (!user) {
            logger.error(`El usuario con el email: ${userEntity.email} no existe`);
            throw Error('El email o el password son incorrectos');
        }

        // TODO: llevarlo al utils 

        const isPasswordCorrect = await bcrypt.compare(userEntity.passwordHash, user.passwordHash);
        if (!isPasswordCorrect) {
            logger.error(`La contraseña es incorrecta : ${userEntity.passwordHash}`);
            throw Error('El email o el password son incorrectos');
        }

        const token = this.encrypt.encrypt({ userId: user.id });
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