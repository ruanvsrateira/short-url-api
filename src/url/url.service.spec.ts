import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from "@nestjs/testing";
import { TestUtil } from "../utils/Test.util";
import { UrlService } from "./url.service";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaModule } from "../prisma/prisma.module";

describe("Event Service", () => {
    let service: UrlService;

    const prismaMockRepository = {
        url: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
        }
    }

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UrlService, {
                provide: PrismaService,
                useValue: prismaMockRepository,
            }],
            imports: [PrismaModule]
        }).compile()

        service = module.get<UrlService>(UrlService)
    })

    beforeEach(() => {
        prismaMockRepository.url.create.mockReset()
        prismaMockRepository.url.findMany.mockReset()
        prismaMockRepository.url.findUnique.mockReset()
    })

    it("Should be defined", async () => {
        expect(service).toBeDefined()
    })

    describe("Testing Find Services", () => {
        it("Should be return many urls", async () => {

            const url = TestUtil.giveMeUrlValid()
            prismaMockRepository.url.findMany.mockReturnValue([url, url])
            const urls = await service.getAllUrls()

            expect(urls).toHaveLength(2)
            expect(prismaMockRepository.url.findMany).toHaveBeenCalledTimes(1)

        })

        it("Should be return one url", async() => {
            const url = TestUtil.giveMeUrlValid()
            prismaMockRepository.url.findUnique.mockReturnValue(url)
            const urlFounded = await service.getUrl(url.shortedUrl)

            expect(urlFounded).toEqual(url.url)
            expect(prismaMockRepository.url.findUnique).toHaveBeenCalledTimes(1)
        })

        it("Should be throw new NotFound Exception", async() => {
            prismaMockRepository.url.findUnique.mockReturnValue(null)

            expect(service.getUrl('TestingShortUrl')).rejects.toBeInstanceOf(NotFoundException)
            expect(prismaMockRepository.url.findUnique).toHaveBeenCalledTimes(1)
        })
    })

    describe("Testing Create new Url Shorted Service", () => {
        it("Should be return new Url generated", async() => {
            const url = TestUtil.giveMeUrlValid()
            prismaMockRepository.url.create.mockReturnValue(url)
            const urlCreated = await service.shortUrl({ url: url.url });

            expect(urlCreated).toMatchObject({
                newUrl: `http://localhost:3000/${url.shortedUrl}`
            })
            expect(prismaMockRepository.url.create).toHaveBeenCalledTimes(1)
        })

        it("Should be throw new Error Not url provided", async() => {
            expect(service.shortUrl({ url: "" })).rejects.toBeInstanceOf(BadRequestException)
        })
    })
})