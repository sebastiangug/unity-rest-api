import { Request, Response } from 'express';

export let hi = (req: Request, res: Response) => {
    res.send('Hello');
};

export let awesome = (req: Request, res: Response) => {
    res.send('EVERYTHING IS AWESOME');
};
