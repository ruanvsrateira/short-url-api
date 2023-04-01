import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUrl } from "class-validator";

export class CreateUrlDTO {
    @IsString()
    @IsUrl({ require_protocol: true })
    @ApiProperty()
    url: string
}