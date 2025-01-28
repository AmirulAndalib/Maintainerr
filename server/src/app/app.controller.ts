import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller('/api/app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/status')
  @ApiOperation({ summary: 'Get app status' })
  @ApiResponse({
    status: 200,
    description: 'App status retreived',
  })
  async getAppStatus() {
    return JSON.stringify(await this.appService.getAppVersionStatus());
  }

  @Get('/timezone')
  async getAppTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
}
