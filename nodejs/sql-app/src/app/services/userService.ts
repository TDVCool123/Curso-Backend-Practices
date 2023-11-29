import { IUserEntity } from "../../domain/entities/IUserEntity";
import { ICacheService } from "../../domain/interfaces/cacheRepository";
import { RoleRepository } from "../../domain/interfaces/roleRepository";
import { UserRepository } from "../../domain/interfaces/userRepository";
import { User } from "../../domain/models/user";
import logger from "../../infrastructure/logger/logger";
import { CreateUserDTO } from "../dtos/create.user.dto";
import { UserDto } from '../dtos/user.dto';

export class UserService {
    constructor(private userRepository: UserRepository, private roleRepository: RoleRepository, private redisCacheService: ICacheService) {
        this.getCache()
     }
     getCache(){
        const USER_KEY = 'USER'
        const userID = '9e95f28b-b323-44a5-9bac-7a6ea3f8e1d6'
        const ROLE_KEY = "ROLE"
        const roleID = "1234"
     }
    
    
    async getUserById(id: string): Promise<UserDto | null> {
        const userCache =  this.redisCacheService.get(id)

        //const userCache = await this.redisCacheService.get(`${USER_KEY}:${userID}`);
        const userObject= JSON.parse(await userCache)
        if(userObject){
            return userObject
            console.log("🚀 ~ file: authService.ts:23 ~ AuthService ~ getCache ~ userObjec:", userObject)
        } else{
            // log.debug user
            const user = await this.userRepository.findById(id);
            if (!user) return null;

            const userResponse: UserDto = {
                id: user.id,
                username: user.username,
                email: user.email,
                lastLogin: user.lastLogin
            }
            // log.info user obtenido exitosamente
            return userResponse;
        }

        

        
    }

    async createUser(userDto: CreateUserDTO): Promise<User> {
        const role = await this.roleRepository.findById(userDto.roleId);
        if (!role) {
            throw new Error('Rol no encontrado');
        }


        const userEntity: IUserEntity = {
            username: userDto.username,
            email: userDto.email,
            passwordHash: userDto.password,
            createdAt: new Date(),
            lastLogin: null,
            role
        };
        const newUser = new User(userEntity);

        return this.userRepository.createUser(newUser);
    }

    async deleteUser(userId: string): Promise<void> {
        logger.debug(`UserService: Intentando eliminar al usuario con ID: ${userId}`);
        await this.userRepository.deleteUser(userId);
    }

    async updateUser(userId: string, updateData: Partial<CreateUserDTO>): Promise<User> {
        logger.debug(`UserService: Intentando actualizar al usuario con ID: ${userId}`);
        return this.userRepository.updateUser(userId, updateData);
    }
}
