import DataScraperFetcher from './DataScraperFetcher.js'

// Batoto Scraper
export default class SiteBScraper extends DataScraperFetcher {
    /**
     * Scrapes the Site B webpage and extracts the title, url, image,
     * latest chapter title, chapter number, chapter url and release date.
     *
     * @returns {Object} Scraped data
     * @throws {Error} If there's an error while scraping
     */
    async scrape() {
        await this.init()

        try {
            // console.log('Scraping Site B...')

            // Fetch the HTML content of the webpage
            const $ = await this.fetchData()

            // Get the title of the webpage
            this.title = $('.item-title').text().trim()

            // Get the URL of the cover image
            this.img = $('.attr-cover').find('img').attr('src')

            // Get the element containing the latest chapter information
            const latestChapterElement = $('.main').first()

            if (!latestChapterElement) {
                throw new Error('No latest chapter found on page')
            }

            // Get the title of the latest chapter
            this.lastChapter.title = latestChapterElement
                .find('.p-2')
                .first()
                .find('a')
                .find('span')
                .first()
                .text()
                .trim()
                .replace(': ', '')

            // Get the chapter number of the latest chapter
            const chapterNumberElement = latestChapterElement
                .find('.p-2')
                .first()
                .find('b')
            const chapterNumber = chapterNumberElement
                .text()
                .trim()
                .split(' ')
                .slice(1)
                .join('')

            // Convert the chapter number to an integer
            this.lastChapter.number = parseInt(chapterNumber, 10)
            if (isNaN(this.lastChapter.number)) {
                console.log('Error: Chapter number is NaN, Using Site B')
            }

            // Get the URL of the latest chapter
            const chapterUrlElement = latestChapterElement.find('a')
            this.lastChapter.url =
                new URL(this.url).hostname + chapterUrlElement.attr('href')

            // Get the release date of the latest chapter
            const releaseDateElement = latestChapterElement.find(
                '.chapter-release-date',
            )
            this.lastChapter.date = releaseDateElement.text().trim()

            if (this.lastChapter.date === '') {
                this.lastChapter.date = 'New Chapter'
            }

            // Return the scraped data
            // console.log('Data scraped successfully')
            return this
        } catch (error) {
            console.error('Error while scraping Bato: ', error)
            throw error
        }
    }
}
