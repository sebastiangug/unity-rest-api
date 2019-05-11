import winston from 'winston';
import { Logger } from 'winston';

const logger: Logger = winston.createLogger({
    level: 'silly',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console({
            level: 'error',
            format: winston.format.json()
        })
    ]
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
            level: 'silly'
        })
    );
}

export default logger;
