import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RuleDto } from './rule.dto';

export class CommunityRule {
  @ApiPropertyOptional({
    description: 'Unique identifier for the community rule',
  })
  id?: number;

  @ApiPropertyOptional({ description: 'Karma score for the community rule' })
  karma?: number;

  @ApiPropertyOptional({ description: 'Application version compatibility' })
  appVersion?: string;

  @ApiProperty({ description: 'Name of the community rule' })
  name: string;

  @ApiProperty({ description: 'Description of the community rule' })
  description: string;

  @ApiProperty({
    description: 'Rule configuration in JSON format',
    type: () => RuleDto,
  })
  JsonRules: RuleDto;
}
