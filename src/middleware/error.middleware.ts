import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import express from 'express';
import joi from 'joi';

export type CustomErrors = express.ErrorRequestHandler & {
    message?: string;
    details?: joi.ValidationErrorItem[];
};

const errorMiddleware = (
    error: CustomErrors,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    switch (error.name) {
        case 'database':
            return res.status(500).send('Unknown database error.');
        case 'invalidInput':
            return res.status(400).send(error.details[0].message);
        case 'permissions':
            return res
                .status(403)
                .send('You do not have permission to do this');
        case 'not-found':
            return res.status(404).send('Could not find resource');
        case 'duplicate':
            return res.status(400).send(error.message);
        case 'no-matches':
            return res
                .status(400)
                .send('Could not find user within your organisation');
        case 'not-signed-up':
            return res.status(401).send(error.message);
        default:
            res.status(500).send('Unknown Internal Server Error');
    }
};

export default errorMiddleware;
