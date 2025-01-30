import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RuleDbDto {
  @ApiPropertyOptional({
    description: 'The unique identifier for the rule (auto-generated).',
  })
  id?: number; // Optional during creation, required during updates.

  @ApiProperty({
    description: 'The JSON representation of the rule logic.',
  })
  ruleJson: string; // Always required.

  @ApiProperty({
    description: 'The section of the rule within a group.',
  })
  section: number; // Always required.

  @ApiProperty({
    description: 'The ID of the rule group this rule belongs to.',
  })
  ruleGroupId: number; // Always required.

  @ApiPropertyOptional({
    description: 'Indicates if the rule is active.',
    default: true,
  })
  isActive?: boolean; // Optional during creation, defaults to true.
}
