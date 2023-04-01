import { Url } from "@prisma/client";

export class TestUtil {
    static giveMeUrlValid(): Url {
        return {
            url: "https://google.com",
            shortedUrl: "fweaFe"
        }
    }
}