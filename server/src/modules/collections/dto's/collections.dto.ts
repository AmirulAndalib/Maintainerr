import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ICollection } from '../interfaces/collection.interface';
import { EPlexDataType } from '../../api/plex-api/enums/plex-data-type-enum';

export class BaseCollectionDto implements ICollection {
  @ApiProperty({ description: 'Collection name' })
  name: string;

  @ApiPropertyOptional({ description: 'Collection description' })
  description?: string;

  @ApiProperty({ description: 'Library identifier' })
  libraryId: number;

  @ApiProperty({ description: 'Media type identifier' })
  typeId: number;

  @ApiProperty({
    description: 'Collection type',
    example: 'movie',
  })
  type: EPlexDataType;

  @ApiProperty({
    description: 'Collection title',
    example: 'My Movie Collection',
  })
  title: string;

  @ApiProperty({
    description: 'Collection active status',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Array of collection actions',
  })
  arrAction: number;
}

export class CollectionDto extends BaseCollectionDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: number;

  @ApiProperty({ description: 'Active status' })
  active: boolean;
}
