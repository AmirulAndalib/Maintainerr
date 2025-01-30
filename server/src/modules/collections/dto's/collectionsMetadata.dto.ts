import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MediaMetadataDto {
  @ApiProperty({ description: 'Media identifier' })
  id: number;

  @ApiProperty({ description: 'Media title' })
  title: string;

  @ApiProperty({ description: 'Release year' })
  year: number;

  @ApiPropertyOptional({ description: 'TMDB identifier' })
  tmdbId?: number;

  @ApiPropertyOptional({ description: 'IMDB identifier' })
  imdbId?: string;
}

export class CollectionMediaDto {
  @ApiProperty({ description: 'Collection identifier' })
  collectionId: number;

  @ApiProperty({ description: 'Media identifier' })
  mediaId: number;

  @ApiProperty({ type: () => MediaMetadataDto })
  metadata: MediaMetadataDto;
}
