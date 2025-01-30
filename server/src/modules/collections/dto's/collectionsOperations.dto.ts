import { ApiProperty } from '@nestjs/swagger';
import { MediaMetadataDto } from './collectionsMetadata.dto';

export class CollectionOperationDto {
  @ApiProperty({ description: 'Collection identifier' })
  collectionId: number;

  @ApiProperty({ description: 'Media identifier' })
  mediaId: number;

  @ApiProperty({ type: () => MediaMetadataDto })
  metadata: MediaMetadataDto;

  @ApiProperty({
    description: 'Operation action (0: add, 1: remove)',
    enum: [0, 1],
  })
  action?: 0 | 1;
}
