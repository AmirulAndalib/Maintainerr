import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RuleOperators, RulePossibility } from '../constants/rules.constants';

export class RuleDto {
  @ApiPropertyOptional({
    description: 'The operator to apply for the rule, if applicable.',
    enum: RuleOperators,
    nullable: true,
  })
  operator: RuleOperators | null; // Nullable as it is not always used.

  @ApiProperty({
    description: 'The action to perform for this rule.',
    enum: RulePossibility,
  })
  action: RulePossibility; // Required because it is always validated.

  @ApiProperty({
    description: 'The first value for the rule, represented as a tuple of IDs.',
    example: [1, 2],
  })
  firstVal: [number, number]; // Required because it is always validated.

  @ApiPropertyOptional({
    description:
      'The second value for the rule, represented as a tuple of IDs.',
    example: [3, 4],
  })
  lastVal?: [number, number]; // Optional because it is conditionally checked.

  @ApiPropertyOptional({
    description:
      'Custom value for the rule, used when specific types and values are needed.',
    example: { ruleTypeId: 1, value: 'example' },
  })
  customVal?: { ruleTypeId: number; value: string }; // Optional because it is conditionally checked.

  @ApiProperty({
    description: 'The section to which this rule belongs.',
  })
  section: number; // Required because it is always passed during creation or updates.
}
