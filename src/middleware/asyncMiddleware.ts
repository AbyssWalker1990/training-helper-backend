import type { Request, Response, NextFunction } from 'express'

const asyncMiddleware = (middlewareFunction: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    middlewareFunction(req, res, next).catch(next)
  }
}

export default asyncMiddleware
