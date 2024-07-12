import ReadingScraper from './ReadingScraper.js'

// Batoto Scraper
export default class SiteBScraper extends ReadingScraper {
    /**
     * Scrapes the Site B webpage and extracts the title, url, image,
     * latest chapter title, chapter number, chapter url and release date.
     *
     * @returns {Object} Scraped data
     * @throws {Error} If there's an error while scraping
     */
    async scrape() {
        try {
            console.log('Scraping Site B...')

            // Fetch the HTML content of the webpage
            const $ = await this.fetchData()

            // Get the title of the webpage
            this.title = $('.item-title').text().trim()

            // Get the URL of the cover image
            this.img = $('.attr-cover').find('img').attr('src')

            // Get the element containing the latest chapter information
            const latestChapterElement = $('.main').first()
            if (!latestChapterElement) {
                throw new Error('No latest chapter found')
            }

            // Get the title of the latest chapter
            this.lastChapter.title = latestChapterElement
                .find('.p-2')
                .first()
                .find('a')
                .find('span')
                .text()
                .trim()

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
                throw new Error('Invalid chapter number')
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

            // Return the scraped data
            console.log('Data scraped successfully')
            return this
        } catch (error) {
            console.error('Error while scraping Bato: ', error)
            throw error
        }
    }
}
