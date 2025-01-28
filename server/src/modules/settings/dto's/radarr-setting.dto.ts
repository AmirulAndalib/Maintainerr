import { ApiProperty } from '@nestjs/swagger';
//import { ICollection } from '../../collections/interfaces/collection.interface';

export class RadarrSettingDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  serverName: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  apiKey: string;
}

export class RadarrSettingRawDto {
  @ApiProperty()
  serverName: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  apiKey: string;
}

export class RadarrSettingResponseDtoOK {
  @ApiProperty({ enum: ['OK'] })
  status: 'OK';

  @ApiProperty()
  code: 1;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: RadarrSettingDto })
  data: RadarrSettingDto;
}

export class RadarrSettingResponseDtoNOK {
  @ApiProperty({ enum: ['NOK'] })
  status: 'NOK';

  @ApiProperty()
  code: 0;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  data?: never;
}
export type RadarrSettingResponseDto =
  | RadarrSettingResponseDtoOK
  | RadarrSettingResponseDtoNOK;
export class DeleteRadarrSettingResponseDtoOK {
  @ApiProperty({ enum: ['OK'] })
  status: 'OK';

  @ApiProperty()
  code: 1;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  data?: never;
}

export class DeleteRadarrSettingResponseDtoNOK {
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
      [key: string]: any; // Adjust this if you know the exact shape of `ICollection`
    }>;
  } | null;
}
export type DeleteRadarrSettingResponseDto =
  | DeleteRadarrSettingResponseDtoOK
  | DeleteRadarrSettingResponseDtoNOK;
