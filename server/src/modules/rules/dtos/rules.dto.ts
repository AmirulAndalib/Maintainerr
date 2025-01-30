import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ICollection } from '../../collections/interfaces/collection.interface';
import { RuleDto } from './rule.dto';
import { RuleDbDto } from './ruleDb.dto';
import { EPlexDataType } from '../../api/plex-api/enums/plex-data-type-enum';

export class RulesDto {
  @ApiPropertyOptional({ description: 'The unique identifier for the rule.' })
  id?: number;

  @ApiProperty({ description: 'The library ID associated with the rule.' })
  libraryId: number;

  @ApiProperty({ description: 'The name of the rule.' })
  name: string;

  @ApiProperty({ description: 'A description of the rule.' })
  description: string;

  @ApiPropertyOptional({
    description: 'Indicates if the rule is active.',
    default: true,
  })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'The action to perform for Servarr.',
    default: 0,
  })
  arrAction?: number;

  @ApiPropertyOptional({
    description: 'Indicates if the rule should use additional rules.',
    default: true,
  })
  useRules?: boolean;

  @ApiPropertyOptional({
    description: 'The collection associated with the rule.',
  })
  collection?: ICollection;

  @ApiPropertyOptional({
    description: 'Indicates if exclusions should be listed.',
    default: false,
  })
  listExclusions?: boolean;

  @ApiPropertyOptional({
    description: 'Indicates if Overseerr should be forced.',
    default: false,
  })
  forceOverseerr?: boolean;

  @ApiProperty({
    description: 'The rules associated with the rule.',
    type: [RuleDto],
    oneOf: [{ $ref: RuleDto.name }, { $ref: RuleDbDto.name }],
  })
  rules: RuleDto[] | RuleDbDto[];

  @ApiPropertyOptional({
    description: 'Indicates if this is a manual collection.',
    default: false,
  })
  manualCollection?: boolean;

  @ApiPropertyOptional({
    description: 'The name of the manual collection, if applicable.',
  })
  manualCollectionName?: string;

  @ApiProperty({
    description: 'The data type for Plex.',
    enum: EPlexDataType,
  })
  dataType: EPlexDataType;

  @ApiPropertyOptional({
    description:
      'Override percentage for Tautulli watched percentage for this rule.',
  })
  tautulliWatchedPercentOverride?: number;

  @ApiPropertyOptional({
    description: 'The ID of the Radarr settings associated with this rule.',
  })
  radarrSettingsId?: number;

  @ApiPropertyOptional({
    description: 'The ID of the Sonarr settings associated with this rule.',
  })
  sonarrSettingsId?: number;
}
