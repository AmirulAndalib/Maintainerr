import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ECollectionLogType } from '../entities/collection_log.entities';

export class CollectionLogDto {
  @ApiProperty({ description: 'Log entry identifier' })
  id: number;

  @ApiProperty({ description: 'Collection identifier' })
  collectionId: number;

  @ApiPropertyOptional({ description: 'Media identifier' })
  mediaId?: number;

  @ApiProperty({ enum: ECollectionLogType })
  type: ECollectionLogType;

  @ApiProperty({ description: 'Log message' })
  message: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;
}
