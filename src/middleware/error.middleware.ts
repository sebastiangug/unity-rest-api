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
        // JOI Input validation errors will come here
        case 'invalidInput':
            return res.status(400).send(error.details[0].message);

        // Permissions middleware will come here.
        case 'permissions':
            return res
                .status(403)
                .send(error.message || 'Insuficient permissions');

        // Requesting to do stuff on resources that no longer exist/we can't find will come here
        case 'not-found':
            return res
                .status(404)
                .send(error.message || 'Could not find resource');

        // If we're trying to create a resource that already exists we come here.
        case 'duplicate':
            return res.status(400).send(error.message);

        default:
            res.status(500).send(error.message || 'Unknown Error');
    }
};

export default errorMiddleware;
