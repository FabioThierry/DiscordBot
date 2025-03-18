import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import ReadingScraper from '../DataScraperFetcher'

describe('ReadingScraper', () => {
    const testUrl =
        'http://harimanga.me/manga/into-the-light-once-again/chapter-98/'
    const invalidUrl = 'invalid-url'
    let scraper
    let scraperError

    beforeEach(() => {
        scraper = new ReadingScraper(testUrl)
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    test('should initialize properties correctly in the constructor', () => {
        expect(scraper.url).toBe(testUrl)
        expect(scraper.title).toBe('')
        expect(scraper.img).toBe('')
        expect(scraper.lastChapter).toEqual({
            title: '',
            url: '',
            number: 0,
            date: '',
        })
        expect(scraper.lastCheckedDate).toBeInstanceOf(Date)
    })

    test('isValidUrl should return true for a valid URL', async () => {
        expect(await scraper.isValidUrl(testUrl)).toBe(true)
    })

    test('isValidUrl should return true for a valid URL', async () => {
        expect(await scraper.isValidUrl(invalidUrl)).toBe(false)
    })

    test('fetchData should call axios.get with the correct URL and return a cheerio loaded function', async () => {
        const fakeHTML =
            '<html><body><div id="test">Hello World</div></body></html>'
        const axiosGetSpy = vi
            .spyOn(axios, 'get')
            .mockResolvedValue({ data: fakeHTML })

        const $ = await scraper.fetchData()

        expect(axiosGetSpy).toHaveBeenCalledWith(testUrl)
        // Validate returned cheerio function by checking the extracted text.
        expect($('#test').text()).toBe('Hello World')
    })

    test('fetchData should throw an error when axios fails', async () => {
        vi.spyOn(axios, 'get').mockRejectedValue(new Error('Network error'))
        vi.spyOn(scraper, 'isValidUrl').mockResolvedValue(true)

        await expect(scraper.fetchData()).rejects.toThrow('Network error')
    })

    test('scrape should throw an error indicating the method is not implemented', async () => {
        await expect(scraper.scrape()).rejects.toThrow(
            'Method not implemented.',
        )
    })
})
