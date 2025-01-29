import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { CollectionWorkerService } from './collection-worker.service';
import { CollectionsService } from './collections.service';
import { BaseCollectionDto, CollectionDto } from "./dto's/collections.dto";
import { CollectionLogDto } from "./dto's/collectionsLog.dto";
import { MediaMetadataDto } from "./dto's/collectionsMetadata.dto";
import { CollectionOperationDto } from "./dto's/collectionsOperations.dto";
import { ECollectionLogType } from './entities/collection_log.entities';

@ApiTags('Collections')
@Controller('api/collections')
export class CollectionsController {
  constructor(
    private readonly collectionService: CollectionsService,
    private readonly collectionWorkerService: CollectionWorkerService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create new collection' })
  @ApiBody({ type: BaseCollectionDto })
  @ApiResponse({ status: 201, type: CollectionDto })
  async createCollection(
    @Body() request: BaseCollectionDto,
  ): Promise<CollectionDto> {
    const response =
      await this.collectionService.createCollectionWithChildren(request);

    return {
      id: response.dbCollection.id,
      name: response.plexCollection.title,
      active: true,
      libraryId: request.libraryId,
      typeId: request.typeId,
      description: request.description,
      type: request.type,
    };
  }

  @Post('/add')
  @ApiOperation({ summary: 'Add media to collection' })
  @ApiBody({ type: CollectionOperationDto })
  @ApiResponse({ status: 201, description: 'Media added to collection' })
  addToCollection(@Body() request: CollectionOperationDto) {
    return this.collectionService.addToCollection(
      request.collectionId,
      [request],
      false,
    );
  }

  @Post('/remove')
  @ApiOperation({ summary: 'Remove media from collection' })
  @ApiBody({ type: CollectionOperationDto })
  @ApiResponse({ status: 200, description: 'Media removed from collection' })
  removeFromCollection(@Body() request: CollectionOperationDto) {
    return this.collectionService.removeFromCollection(request.collectionId, [
      request,
    ]);
  }

  @Post('/removeCollection')
  @ApiOperation({ summary: 'Delete collection' })
  @ApiBody({ schema: { properties: { collectionId: { type: 'number' } } } })
  @ApiResponse({ status: 200, description: 'Collection deleted' })
  removeCollection(@Body('collectionId') collectionId: number) {
    return this.collectionService.deleteCollection(collectionId);
  }

  @Put()
  @ApiOperation({ summary: 'Update collection' })
  @ApiBody({ type: CollectionDto })
  @ApiResponse({ status: 200, type: CollectionDto })
  updateCollection(@Body() collection: CollectionDto): Promise<CollectionDto> {
    return this.collectionService.updateCollection(collection);
  }

  @Post('/handle')
  @ApiOperation({ summary: 'Handle collection execution' })
  @ApiResponse({ status: 201, description: 'Collection handled' })
  handleCollection() {
    return this.collectionWorkerService
      .execute()
      .catch((e) => console.error(e));
  }

  @Put('/schedule/update')
  @ApiOperation({ summary: 'Update schedule' })
  @ApiBody({ schema: { properties: { schedule: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Schedule updated' })
  updateSchedule(@Body() request: { schedule: string }) {
    return this.collectionWorkerService.updateJob(request.schedule);
  }

  @Get('/deactivate/:id')
  @ApiOperation({ summary: 'Deactivate collection' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, type: CollectionDto })
  deactivate(@Param('id') id: number): Promise<CollectionDto> {
    return this.collectionService.deactivateCollection(id);
  }

  @Get('/activate/:id')
  @ApiOperation({ summary: 'Activate collection' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, type: CollectionDto })
  activate(@Param('id') id: number): Promise<CollectionDto> {
    return this.collectionService.activateCollection(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get collections' })
  @ApiQuery({ name: 'libraryId', required: false, type: 'number' })
  @ApiQuery({ name: 'typeId', required: false, enum: [1, 2, 3, 4] })
  @ApiResponse({ status: 200, type: [CollectionDto] })
  getCollections(
    @Query('libraryId') libraryId: number,
    @Query('typeId') typeId: 1 | 2 | 3 | 4,
  ): Promise<CollectionDto[]> {
    if (libraryId) {
      return this.collectionService.getCollections(libraryId, undefined);
    } else if (typeId) {
      return this.collectionService.getCollections(undefined, typeId);
    }
    return this.collectionService.getCollections(undefined, undefined);
  }

  @Get('/collection/:id')
  @ApiOperation({ summary: 'Get collection by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, type: CollectionDto })
  getCollection(@Param('id') collectionId: number): Promise<CollectionDto> {
    return this.collectionService.getCollection(collectionId);
  }

  @Post('/media/add')
  @ApiOperation({ summary: 'Manual media collection action' })
  @ApiBody({ type: CollectionOperationDto })
  @ApiResponse({ status: 201, description: 'Media action performed' })
  ManualActionOnCollection(@Body() request: CollectionOperationDto) {
    return this.collectionService.MediaCollectionActionWithContext(
      request.collectionId,
      request.metadata,
      { plexId: request.mediaId },
      request.action === 0 ? 'add' : 'remove',
    );
  }

  @Delete('/media')
  @ApiOperation({ summary: 'Delete media from collection(s)' })
  @ApiQuery({ name: 'mediaId', required: true, type: 'number' })
  @ApiQuery({ name: 'collectionId', required: false, type: 'number' })
  @ApiResponse({ status: 200, description: 'Media deleted' })
  deleteMediaFromCollection(
    @Query('mediaId') mediaId: number,
    @Query('collectionId') collectionId: number,
  ) {
    if (!collectionId) {
      return this.collectionService.removeFromAllCollections([
        { plexId: mediaId },
      ]);
    }
    return this.collectionService.removeFromCollection(collectionId, [
      { plexId: mediaId },
    ]);
  }

  @Get('/media')
  @ApiOperation({ summary: 'Get media in collection' })
  @ApiQuery({ name: 'collectionId', required: true, type: 'number' })
  @ApiResponse({ status: 200, type: [MediaMetadataDto] })
  getMediaInCollection(@Query('collectionId') collectionId: number) {
    return this.collectionService.getCollectionMedia(collectionId);
  }

  @Get('/media/count')
  @ApiOperation({ summary: 'Get media count in collection' })
  @ApiQuery({ name: 'collectionId', required: true, type: 'number' })
  @ApiResponse({ status: 200, type: Number })
  getMediaInCollectionCount(
    @Query('collectionId') collectionId: number,
  ): Promise<number> {
    return this.collectionService.getCollectionMediaCount(collectionId);
  }

  @Get('/media/:id/content/:page')
  @ApiOperation({ summary: 'Get paginated collection media' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiParam({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'size', required: false, type: 'number' })
  @ApiResponse({ status: 200, type: [MediaMetadataDto] })
  getLibraryContent(
    @Param('id') id: number,
    @Param('page', new ParseIntPipe()) page: number,
    @Query('size') amount: number,
  ) {
    const size = amount || 25;
    const offset = (page - 1) * size;
    return this.collectionService.getCollectionMediaWitPlexDataAndhPaging(id, {
      offset,
      size,
    });
  }

  @Get('/exclusions/:id/content/:page')
  @ApiOperation({ summary: 'Get paginated collection exclusions' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiParam({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'size', required: false, type: 'number' })
  @ApiResponse({ status: 200, type: [MediaMetadataDto] })
  getExclusions(
    @Param('id') id: number,
    @Param('page', new ParseIntPipe()) page: number,
    @Query('size') amount: number,
  ) {
    const size = amount || 25;
    const offset = (page - 1) * size;
    return this.collectionService.getCollectionExclusionsWithPlexDataAndhPaging(
      id,
      {
        offset,
        size,
      },
    );
  }

  @Get('/logs/:id/content/:page')
  @ApiOperation({ summary: 'Get paginated collection logs' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiParam({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'size', required: false, type: 'number' })
  @ApiQuery({ name: 'search', required: false, type: 'string' })
  @ApiQuery({ name: 'sort', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'filter', required: false, enum: ECollectionLogType })
  @ApiResponse({ status: 200, type: [CollectionLogDto] })
  getCollectionLogs(
    @Param('id') id: number,
    @Param('page', new ParseIntPipe()) page: number,
    @Query('size') amount: number,
    @Query('search') search: string,
    @Query('sort') sort: 'ASC' | 'DESC' = 'DESC',
    @Query('filter') filter: ECollectionLogType,
  ) {
    const size = amount || 25;
    const offset = (page - 1) * size;
    return this.collectionService.getCollectionLogsWithPaging(
      id,
      { offset, size },
      search,
      sort,
      filter,
    );
  }
}
