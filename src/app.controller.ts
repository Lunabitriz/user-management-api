import { AppService } from './app.service';
import { Controller } from '@nestjs/common';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}
}