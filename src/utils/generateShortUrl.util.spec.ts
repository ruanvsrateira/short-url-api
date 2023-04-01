import { generateShortUrl } from "./generateShortUrl.util"

describe("Testing Generate Short Url", () => {
    test("Should be return shorted url", () => {
        const url = generateShortUrl()
        const arrayUrl = url.split("")

        expect(arrayUrl).toHaveLength(7)
    })
})