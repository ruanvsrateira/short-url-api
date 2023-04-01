import { Body, Controller, Get, Param, Post, Request, Response } from "@nestjs/common";
import { UrlService } from "./url.service.js";
import { CreateUrlDTO } from "./dto/create-url.dto.js";
import { Url } from "@prisma/client";
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("URL")
@Controller()
export class UrlController {

    constructor(private readonly urlService: UrlService) {}

    @Post("short")
    @ApiResponse({ status: 400, description: "Url not Provided" })
    @ApiResponse({ status: 201, description: "Url Created sucessfully" })
    async shortUrl(@Body() data: CreateUrlDTO) {
        return this.urlService.shortUrl({ url: data.url })
    }

    @Get()
    @ApiResponse({ status: 200, description: "Return All Urls Registred" })
    async getAllUrls(): Promise<Url[]> {
        return this.urlService.getAllUrls()
    }

    @Get(":url")
    @ApiResponse({ status: 404, description: "Url Not Founded" })
    @ApiResponse({ status: 200, description: "Url Returned" })
    async getUrl(@Param("url") shortedUrl: string, @Response() response) {   
        const url = await this.urlService.getUrl(shortedUrl);
    
        response.redirect(url);
    }

}