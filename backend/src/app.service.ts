import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck() {
    return {
      status: 'ok',
      service: 'POS System API',
      timestamp: new Date().toISOString(),
    };
  }
}
