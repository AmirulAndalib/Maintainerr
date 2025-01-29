import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IAlterableMediaDto } from '../../collections/interfaces/collection-media.interface';

export enum ExclusionAction {
  ADD,
  REMOVE,
}

export class ExclusionDto {
  @ApiProperty({ description: 'Plex media ID' })
  plexId: number;

  @ApiPropertyOptional({ description: 'Rule group identifier' })
  ruleGroupId?: number;

  @ApiPropertyOptional({ description: 'Collection identifier' })
  collectionId?: number;

  @ApiPropertyOptional({
    enum: ExclusionAction,
    description: 'Action to perform',
  })
  action?: ExclusionAction;
}

export class ExclusionContextDto {
  @ApiProperty({ description: 'Media identifier' })
  mediaId: number;

  @ApiProperty({ description: 'Media context information' })
  context: IAlterableMediaDto;

  @ApiProperty({ description: 'Collection identifier' })
  collectionId: number;

  @ApiProperty({ description: 'Rule group identifier' })
  ruleGroupId: number;

  @ApiProperty({
    enum: [0, 1],
    description: 'Action to perform (0: ADD, 1: REMOVE)',
  })
  action: 0 | 1;
}
