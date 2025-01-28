import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { SettingDto } from "./dto's/setting.dto";
import { SettingsService } from './settings.service';
import { CronScheduleDto } from "./dto's/cron.schedule.dto";
import { RadarrSettingRawDto } from "./dto's/radarr-setting.dto";
import { SonarrSettingRawDto } from "./dto's/sonarr-setting.dto";

@ApiTags('Settings')
@Controller('/api/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiOperation({ summary: 'Get all settings' })
  @ApiResponse({ status: 200, description: 'List of all settings' })
  @Get()
  getSettings() {
    return this.settingsService.getSettings();
  }

  @ApiOperation({ summary: 'Get Radarr settings' })
  @ApiResponse({
    status: 200,
    description: 'Radarr settings retrieved successfully',
  })
  @Get('/radarr')
  getRadarrSettings() {
    return this.settingsService.getRadarrSettings();
  }

  @ApiOperation({ summary: 'Get Sonarr settings' })
  @ApiResponse({
    status: 200,
    description: 'Sonarr settings retrieved successfully',
  })
  @Get('/sonarr')
  getSonarrSettings() {
    return this.settingsService.getSonarrSettings();
  }

  @ApiOperation({ summary: 'Get application version' })
  @ApiResponse({
    status: 200,
    description: 'Application version retrieved successfully',
  })
  @Get('/version')
  getVersion() {
    return this.settingsService.appVersion();
  }

  @ApiOperation({ summary: 'Generate a new API key' })
  @ApiResponse({ status: 200, description: 'API key generated successfully' })
  @Get('/api/generate')
  generateApiKey() {
    return this.settingsService.generateApiKey();
  }

  @ApiOperation({ summary: 'Delete Plex API authentication' })
  @ApiResponse({
    status: 200,
    description: 'Plex API authentication deleted successfully',
  })
  @Delete('/plex/auth')
  deletePlexApiAuth() {
    return this.settingsService.deletePlexApiAuth();
  }

  @ApiOperation({ summary: 'Update settings' })
  @ApiResponse({ status: 200, description: 'Settings updated successfully' })
  @ApiBody({ type: SettingDto })
  @Post()
  updateSettings(@Body() payload: SettingDto) {
    return this.settingsService.updateSettings(payload);
  }

  @ApiOperation({ summary: 'Update Plex auth token' })
  @ApiBody({
    schema: {
      properties: {
        plex_auth_token: { type: 'string', example: 'myplexauthtoken' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Plex auth token updated successfully',
  })
  @Post('/plex/token')
  updateAuthToken(@Body() payload: { plex_auth_token: string }) {
    return this.settingsService.savePlexApiAuthToken(payload.plex_auth_token);
  }

  @ApiOperation({ summary: 'Test application setup' })
  @ApiResponse({
    status: 200,
    description: 'Application setup tested successfully',
  })
  @Get('/test/setup')
  testSetup() {
    return this.settingsService.testSetup();
  }

  @ApiOperation({ summary: 'Test Overseerr settings' })
  @ApiResponse({
    status: 200,
    description: 'Overseerr settings tested successfully',
  })
  @Get('/test/overseerr')
  testOverseerr() {
    return this.settingsService.testOverseerr();
  }

  @ApiOperation({ summary: 'Test Radarr settings' })
  @ApiBody({ type: RadarrSettingRawDto })
  @ApiResponse({
    status: 200,
    description: 'Radarr settings tested successfully',
  })
  @Post('/test/radarr')
  testRadarr(@Body() payload: RadarrSettingRawDto) {
    return this.settingsService.testRadarr(payload);
  }

  @ApiOperation({ summary: 'Add a new Radarr setting' })
  @ApiBody({ type: RadarrSettingRawDto })
  @ApiResponse({
    status: 200,
    description: 'Radarr setting added successfully',
  })
  @Post('/radarr')
  async addRadarrSetting(@Body() payload: RadarrSettingRawDto) {
    return await this.settingsService.addRadarrSetting(payload);
  }

  @ApiOperation({ summary: 'Update a Radarr setting' })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
    description: 'ID of the Radarr setting to update',
  })
  @ApiBody({ type: RadarrSettingRawDto })
  @ApiResponse({
    status: 200,
    description: 'Radarr setting updated successfully',
  })
  @Put('/radarr/:id')
  async updateRadarrSetting(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() payload: RadarrSettingRawDto,
  ) {
    return await this.settingsService.updateRadarrSetting({
      id,
      ...payload,
    });
  }

  @ApiOperation({ summary: 'Delete a Radarr setting' })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
    description: 'ID of the Radarr setting to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Radarr setting deleted successfully',
  })
  @Delete('/radarr/:id')
  async deleteRadarrSetting(@Param('id', new ParseIntPipe()) id: number) {
    return await this.settingsService.deleteRadarrSetting(id);
  }

  @ApiOperation({ summary: 'Test Sonarr settings' })
  @ApiBody({ type: SonarrSettingRawDto })
  @ApiResponse({
    status: 200,
    description: 'Sonarr settings tested successfully',
  })
  @Post('/test/sonarr')
  testSonarr(@Body() payload: SonarrSettingRawDto) {
    return this.settingsService.testSonarr(payload);
  }

  @ApiOperation({ summary: 'Add a new Sonarr setting' })
  @ApiBody({ type: SonarrSettingRawDto })
  @ApiResponse({
    status: 200,
    description: 'Sonarr setting added successfully',
  })
  @Post('/sonarr')
  async addSonarrSetting(@Body() payload: SonarrSettingRawDto) {
    return await this.settingsService.addSonarrSetting(payload);
  }

  @ApiOperation({ summary: 'Update a Sonarr setting' })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
    description: 'ID of the Sonarr setting to update',
  })
  @ApiBody({ type: SonarrSettingRawDto })
  @ApiResponse({
    status: 200,
    description: 'Sonarr setting updated successfully',
  })
  @Put('/sonarr/:id')
  async updateSonarrSetting(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() payload: SonarrSettingRawDto,
  ) {
    return await this.settingsService.updateSonarrSetting({
      id,
      ...payload,
    });
  }

  @ApiOperation({ summary: 'Delete a Sonarr setting' })
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 1,
    description: 'ID of the Sonarr setting to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Sonarr setting deleted successfully',
  })
  @Delete('/sonarr/:id')
  async deleteSonarrSetting(@Param('id', new ParseIntPipe()) id: number) {
    return await this.settingsService.deleteSonarrSetting(id);
  }

  @ApiOperation({ summary: 'Test Plex settings' })
  @ApiResponse({
    status: 200,
    description: 'Plex settings tested successfully',
  })
  @Get('/test/plex')
  testPlex() {
    return this.settingsService.testPlex();
  }

  @ApiOperation({ summary: 'Test Tautulli settings' })
  @ApiResponse({
    status: 200,
    description: 'Tautulli settings tested successfully',
  })
  @Get('/test/tautulli')
  testTautulli() {
    return this.settingsService.testTautulli();
  }

  @ApiOperation({ summary: 'Get Plex servers' })
  @ApiResponse({
    status: 200,
    description: 'List of Plex servers retrieved successfully',
  })
  @Get('/plex/devices/servers')
  async getPlexServers() {
    return await this.settingsService.getPlexServers();
  }

  @ApiOperation({ summary: 'Validate a CRON expression' })
  @ApiBody({ type: CronScheduleDto })
  @ApiResponse({
    status: 200,
    description: 'CRON expression validated successfully',
  })
  @Post('/cron/validate')
  validateSingleCron(@Body() payload: CronScheduleDto) {
    return this.settingsService.cronIsValid(payload.schedule)
      ? { status: 'OK', code: 1, message: 'Success' }
      : { status: 'NOK', code: 0, message: 'Failure' };
  }
}
