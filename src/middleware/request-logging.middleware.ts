import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
    private logger = new Logger('Request');
    private methodColors: { [key: string]: string } = {
        GET: '\x1b[96m',
        POST: '\x1b[92m',
        PUT: '\x1b[93m',
        PATCH: '\x1b[93m',
        DELETE: '\x1b[91m',
    };

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl, ip } = req;
        const userAgent = req.get('user-agent') || '';

        res.on('finish', () => {
            const contentLength = res.get('content-length');
            const coloredMethod = this.methodColors[method] || '\x1b[93m'; // Default to light yellow

            this.logger.log(
                `${coloredMethod}[${method}]\x1b[0m ${originalUrl} -> ${(res.statusCode)} (${contentLength} b) - ${ip}, ${userAgent}`
            );
        });

        if (next) next();
    }

}
