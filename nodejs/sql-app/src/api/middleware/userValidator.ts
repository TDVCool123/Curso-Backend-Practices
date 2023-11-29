import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwt as jwtConfig } from '../../infrastructure/config/config';
import {body,validationResult}  from "express-validator" 
import { format } from 'path';

export const userValidationRules = () =>{
    return[
        body("username").isAlphanumeric(),
        body('password').isLength({min:8}),
        body('email').isEmail(),
        body('roleId').isLength({min:8})
    ]
}

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors  = validationResult(req);

    if (!errors.isEmpty()) {
       return res.status(400).json({ errors:errors.array() });
    } 
    next();

};  