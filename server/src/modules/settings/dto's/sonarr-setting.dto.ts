import { ApiProperty } from '@nestjs/swagger';

export class SonarrSettingDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  serverName: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  apiKey: string;
}

export class SonarrSettingRawDto {
  @ApiProperty()
  serverName: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  apiKey: string;
}

export class SonarrSettingResponseDtoOK {
  @ApiProperty({ enum: ['OK'] })
  status: 'OK';

  @ApiProperty()
  code: 1;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: SonarrSettingDto })
  data: SonarrSettingDto;
}

export class SonarrSettingResponseDtoNOK {
  @ApiProperty({ enum: ['NOK'] })
  status: 'NOK';

  @ApiProperty()
  code: 0;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  data?: never;
}
export type SonarrSettingResponseDto =
  | SonarrSettingResponseDtoOK
  | SonarrSettingResponseDtoNOK;
export class DeleteSonarrSettingResponseDtoOK {
  @ApiProperty({ enum: ['OK'] })
  status: 'OK';

  @ApiProperty()
  code: 1;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  data?: never;
}

export class DeleteSonarrSettingResponseDtoNOK {
  @ApiProperty({ enum: ['NOK'] })
  status: 'NOK';

  @ApiProperty()
  code: 0;

  @ApiProperty()
  message: string;

  @ApiProperty({ nullable: true })
  data: {
    collectionsInUse: Array<{
      id: number;
      title: string;
      [key: string]: any; // Adjust based on the actual shape of ICollection
    }>;
  } | null;
}
export type DeleteSonarrSettingResponseDto =
  | DeleteSonarrSettingResponseDtoOK
  | DeleteSonarrSettingResponseDtoNOK;
