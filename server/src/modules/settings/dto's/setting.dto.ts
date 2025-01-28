import { ApiProperty } from '@nestjs/swagger';

export class SettingDto {
  @ApiProperty({
    description: 'Unique identifier for the setting',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Client ID associated with the setting',
    example: '12345-abcde',
  })
  clientId: string;

  @ApiProperty({
    description: 'Title of the application',
    example: 'My App',
  })
  applicationTitle: string;

  @ApiProperty({
    description: 'Base URL of the application',
    example: 'https://myapp.example.com',
  })
  applicationUrl: string;

  @ApiProperty({
    description: 'API key for accessing the application',
    example: 'abc123xyz456',
  })
  apikey: string;

  @ApiProperty({
    description: 'Locale setting for the application',
    example: 'en',
  })
  locale: string;

  @ApiProperty({
    description: 'Cache images setting (1 = enabled, 0 = disabled)',
    example: 1,
  })
  cacheImages: number;

  @ApiProperty({
    description: 'Name of the Plex server',
    example: 'My Plex Server',
  })
  plex_name: string;

  @ApiProperty({
    description: 'Hostname of the Plex server',
    example: 'plex.example.com',
  })
  plex_hostname: string;

  @ApiProperty({
    description: 'Port number for the Plex server',
    example: 32400,
  })
  plex_port: number;

  @ApiProperty({
    description: 'Whether Plex server uses SSL (1 = enabled, 0 = disabled)',
    example: 1,
  })
  plex_ssl: number;

  @ApiProperty({
    description: 'Authentication token for the Plex server',
    example: 'plex_auth_token_example',
  })
  plex_auth_token: string;

  @ApiProperty({
    description: 'URL of the Overseerr instance',
    example: 'https://overseerr.example.com',
  })
  overseerr_url: string;

  @ApiProperty({
    description: 'API key for the Overseerr instance',
    example: 'overseerr_api_key_example',
  })
  overseerr_api_key: string;

  @ApiProperty({
    description: 'URL of the Tautulli instance',
    example: 'https://tautulli.example.com',
  })
  tautulli_url: string;

  @ApiProperty({
    description: 'API key for the Tautulli instance',
    example: 'tautulli_api_key_example',
  })
  tautulli_api_key: string;

  @ApiProperty({
    description: 'CRON expression for the collection handler job',
    example: '0 0 * * *',
  })
  collection_handler_job_cron: string;

  @ApiProperty({
    description: 'CRON expression for the rules handler job',
    example: '0 30 * * *',
  })
  rules_handler_job_cron: string;
}
