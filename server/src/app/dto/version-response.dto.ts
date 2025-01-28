import { ApiProperty } from '@nestjs/swagger';

export class VersionResponse {
  @ApiProperty({
    description: 'Status of the version (1 = active, 0 = inactive)',
    enum: [1, 0],
    example: 1, // Example value for the status
  })
  status: 1 | 0;

  @ApiProperty({
    description: 'The version number of the application',
    type: String, // Define the type explicitly
    example: '1.0.0', // Example version
  })
  version: string;

  @ApiProperty({
    description: 'The commit tag associated with the current version',
    type: String, // Define the type explicitly
    example: 'v1.0.0-rc', // Example commit tag
  })
  commitTag: string;

  @ApiProperty({
    description: 'Indicates whether an update is available for the application',
    type: Boolean, // Define the type explicitly
    example: false, // Example value for updateAvailable
  })
  updateAvailable: boolean;
}
