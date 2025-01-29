import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { CommunityRule } from './dtos/communityRule.dto';
import { ExclusionAction, ExclusionContextDto } from './dtos/exclusion.dto';
import { RulesDto } from './dtos/rules.dto';
import { RuleExecutorService } from './tasks/rule-executor.service';
import { ReturnStatus, RulesService } from './rules.service';

@ApiTags('Rules')
@Controller('api/rules')
export class RulesController {
  constructor(
    private readonly rulesService: RulesService,
    private readonly ruleExecutorService: RuleExecutorService,
  ) {}

  @Get('/constants')
  @ApiOperation({ summary: 'Get rule constants' })
  @ApiResponse({
    status: 200,
    description: 'Rule constants retrieved successfully',
  })
  async getRuleConstants() {
    return await this.rulesService.getRuleConstants();
  }

  @Put('/schedule/update')
  @ApiOperation({ summary: 'Update rule schedule' })
  @ApiBody({ schema: { properties: { schedule: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Schedule updated successfully' })
  updateSchedule(@Body() request: { schedule: string }) {
    return this.ruleExecutorService.updateJob(request.schedule);
  }

  @Get('/community')
  @ApiOperation({ summary: 'Get community rules' })
  @ApiResponse({
    status: 200,
    description: 'Community rules retrieved successfully',
  })
  async getCommunityRules() {
    return await this.rulesService.getCommunityRules();
  }

  @Get('/community/count')
  @ApiOperation({ summary: 'Get community rule count' })
  @ApiResponse({ status: 200, description: 'Count retrieved successfully' })
  async getCommunityRuleCount() {
    return this.rulesService.getCommunityRuleCount();
  }

  @Get('/community/karma/history')
  @ApiOperation({ summary: 'Get karma history' })
  @ApiResponse({
    status: 200,
    description: 'Karma history retrieved successfully',
  })
  async getCommunityRuleKarmaHistory() {
    return await this.rulesService.getCommunityRuleKarmaHistory();
  }

  @Get('/exclusion')
  @ApiOperation({ summary: 'Get exclusions' })
  @ApiQuery({ name: 'rulegroupId', required: false, type: Number })
  @ApiQuery({ name: 'plexId', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Exclusions retrieved successfully',
  })
  getExclusion(@Query() query: { rulegroupId?: number; plexId?: number }) {
    return this.rulesService.getExclusions(query.rulegroupId, query.plexId);
  }

  @Get('/count')
  @ApiOperation({ summary: 'Get rule group count' })
  @ApiResponse({ status: 200, description: 'Count retrieved successfully' })
  async getRuleGroupCount() {
    return this.rulesService.getRuleGroupCount();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get rules by ID' })
  @ApiParam({ name: 'id', description: 'Rule ID' })
  @ApiResponse({ status: 200, description: 'Rules retrieved successfully' })
  getRules(@Param('id') id: string) {
    return this.rulesService.getRules(id);
  }

  @Get('/collection/:id')
  @ApiOperation({ summary: 'Get rule group by collection ID' })
  @ApiParam({ name: 'id', description: 'Collection ID' })
  @ApiResponse({
    status: 200,
    description: 'Rule group retrieved successfully',
  })
  getRuleGroupByCollectionId(@Param('id') id: string) {
    return this.rulesService.getRuleGroupByCollectionId(+id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rule groups' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  @ApiQuery({ name: 'libraryId', required: false, type: Number })
  @ApiQuery({ name: 'typeId', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Rule groups retrieved successfully',
  })
  getRuleGroups(
    @Query()
    query: {
      activeOnly?: boolean;
      libraryId?: number;
      typeId?: number;
    },
  ) {
    return this.rulesService.getRuleGroups(
      query.activeOnly !== undefined ? query.activeOnly : false,
      query.libraryId ? query.libraryId : undefined,
      query.typeId ? query.typeId : undefined,
    );
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete rule group' })
  @ApiParam({ name: 'id', description: 'Rule group ID' })
  @ApiResponse({ status: 200, description: 'Rule group deleted successfully' })
  deleteRuleGroup(@Param('id') id: string) {
    return this.rulesService.deleteRuleGroup(+id);
  }

  @Post('/execute')
  @ApiOperation({ summary: 'Execute rules' })
  @ApiResponse({ status: 201, description: 'Rules execution initiated' })
  executeRules() {
    this.ruleExecutorService.execute().catch((e) => console.error(e));
  }

  @Post()
  @ApiOperation({ summary: 'Set rules' })
  @ApiBody({ type: RulesDto })
  @ApiResponse({ status: 201, description: 'Rules set successfully' })
  async setRules(@Body() body: RulesDto): Promise<ReturnStatus> {
    return await this.rulesService.setRules(body);
  }

  @Post('/exclusion')
  @ApiOperation({ summary: 'Set exclusion' })
  @ApiBody({ type: ExclusionContextDto })
  @ApiResponse({ status: 201, description: 'Exclusion set successfully' })
  async setExclusion(@Body() body: ExclusionContextDto): Promise<ReturnStatus> {
    if (body.action === undefined || body.action === ExclusionAction.ADD) {
      return await this.rulesService.setExclusion(body);
    } else {
      return await this.rulesService.removeExclusionWitData(body);
    }
  }

  @Delete('/exclusion/:id')
  @ApiOperation({ summary: 'Remove exclusion' })
  @ApiParam({ name: 'id', description: 'Exclusion ID' })
  @ApiResponse({ status: 200, description: 'Exclusion removed successfully' })
  async removeExclusion(@Param('id') id: string): Promise<ReturnStatus> {
    return await this.rulesService.removeExclusion(+id);
  }

  @Delete('/exclusions/:plexId')
  @ApiOperation({ summary: 'Remove all exclusions for Plex ID' })
  @ApiParam({ name: 'plexId', description: 'Plex ID' })
  @ApiResponse({
    status: 200,
    description: 'All exclusions removed successfully',
  })
  async removeAllExclusion(
    @Param('plexId') plexId: string,
  ): Promise<ReturnStatus> {
    return await this.rulesService.removeAllExclusion(+plexId);
  }

  @Put()
  @ApiOperation({ summary: 'Update rule' })
  @ApiBody({ type: RulesDto })
  @ApiResponse({ status: 200, description: 'Rule updated successfully' })
  async updateRule(@Body() body: RulesDto): Promise<ReturnStatus> {
    return await this.rulesService.updateRules(body);
  }

  @Post()
  @ApiOperation({ summary: 'Update job schedule' })
  @ApiBody({ schema: { properties: { cron: { type: 'string' } } } })
  @ApiResponse({
    status: 201,
    description: 'Job schedule updated successfully',
  })
  async updateJob(@Body() body: { cron: string }): Promise<ReturnStatus> {
    return await this.ruleExecutorService.updateJob(body.cron);
  }

  @Post('/community')
  @ApiOperation({ summary: 'Update community rules' })
  @ApiBody({ type: CommunityRule })
  @ApiResponse({
    status: 201,
    description: 'Community rules updated successfully',
  })
  async updateCommunityRules(
    @Body() body: CommunityRule,
  ): Promise<ReturnStatus> {
    if (body.name && body.description && body.JsonRules) {
      return await this.rulesService.addToCommunityRules(body);
    } else {
      return {
        code: 0,
        result: 'Invalid input',
      };
    }
  }

  @Post('/community/karma')
  @ApiOperation({ summary: 'Update community rule karma' })
  @ApiBody({
    schema: {
      properties: { id: { type: 'number' }, karma: { type: 'number' } },
    },
  })
  @ApiResponse({ status: 201, description: 'Karma updated successfully' })
  async updateCommunityRuleKarma(
    @Body() body: { id: number; karma: number },
  ): Promise<ReturnStatus> {
    if (body.id !== undefined && body.karma !== undefined) {
      return await this.rulesService.updateCommunityRuleKarma(
        body.id,
        body.karma,
      );
    } else {
      return {
        code: 0,
        result: 'Invalid input',
      };
    }
  }

  @Post('/yaml/encode')
  @ApiOperation({ summary: 'Encode rules to YAML' })
  @ApiBody({
    schema: {
      properties: { rules: { type: 'string' }, mediaType: { type: 'number' } },
    },
  })
  @ApiResponse({ status: 201, description: 'Rules encoded successfully' })
  async yamlEncode(
    @Body() body: { rules: string; mediaType: number },
  ): Promise<ReturnStatus> {
    try {
      return this.rulesService.encodeToYaml(
        JSON.parse(body.rules),
        body.mediaType,
      );
    } catch (err) {
      return {
        code: 0,
        result: 'Invalid input',
      };
    }
  }

  @Post('/yaml/decode')
  @ApiOperation({ summary: 'Decode YAML to rules' })
  @ApiBody({
    schema: {
      properties: { yaml: { type: 'string' }, mediaType: { type: 'number' } },
    },
  })
  @ApiResponse({ status: 201, description: 'YAML decoded successfully' })
  async yamlDecode(
    @Body() body: { yaml: string; mediaType: number },
  ): Promise<ReturnStatus> {
    try {
      return this.rulesService.decodeFromYaml(body.yaml, body.mediaType);
    } catch (err) {
      return {
        code: 0,
        result: 'Invalid input',
      };
    }
  }

  @Post('/test')
  @ApiOperation({ summary: 'Test rule group' })
  @ApiBody({
    schema: {
      properties: {
        mediaId: { type: 'string' },
        rulegroupId: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Rule group tested successfully' })
  async testRuleGroup(@Body() body: { mediaId: string; rulegroupId: number }) {
    return this.rulesService.testRuleGroupWithData(
      body.rulegroupId,
      body.mediaId,
    );
  }
}
