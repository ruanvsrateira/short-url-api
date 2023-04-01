import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { Url } from "@prisma/client";
import { generateShortUrl } from "../utils/generateShortUrl.util"
import { CreateUrlDTO } from "./dto/create-url.dto";


@Injectable()
export class UrlService {
    constructor(private readonly prisma: PrismaService) {}

    async shortUrl(data: CreateUrlDTO): Promise<{ newUrl: Url["shortedUrl"] }> {

        if (!data.url) throw new BadRequestException("url not provided")

        const shortedUrl = generateShortUrl()

        const urlCreated = await this.prisma.url.create({
            data: {
                url: data.url,
                shortedUrl,
            }
        })

        return { newUrl: `http://localhost:3000/${urlCreated.shortedUrl}` }

    }

    async getAllUrls(): Promise<Url[]> {
        return this.prisma.url.findMany()
    }

    async getUrl(shortedUrl: string): Promise<Url["url"]> {
        const urlFounded = await this.prisma.url.findUnique({
            where: {
                shortedUrl,
            }
        })

        if (!urlFounded) throw new NotFoundException("url not founded");

        return urlFounded.url
    }

}