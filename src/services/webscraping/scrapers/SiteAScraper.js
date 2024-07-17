import ReadingScraper from './ReadingScraper.js'

// Harimanga Scraper
export default class SiteAScraper extends ReadingScraper {
    /**
     * Scrapes the Site A webpage and extracts the title, url, image,
     * latest chapter title, chapter number, chapter url and release date.
     *
     * @returns {Object} Scraped data
     * @throws {Error} If there's an error while scraping
     */
    async scrape() {
        try {
            // console.log('Scraping Site A...')

            // Fetch the HTML content of the webpage
            const $ = await this.fetchData()

            // Get the title of the webpage
            this.title = $('.post-title').find('h1').text().trim()

            // Get the URL of the cover image
            this.img = $('.summary_image').find('img').attr('src')

            // Get the element containing the latest chapter information
            const latestChapterElement = $('.main').first()
            if (!latestChapterElement) {
                throw new Error('No latest chapter found')
            }

            // Get the title of the latest chapter
            this.lastChapter.title = latestChapterElement
                .find('.wp-manga-chapter')
                .first()
                .find('a')
                .text()
                .trim()

            // Get the chapter number of the latest chapter
            const chapterNumberElement = latestChapterElement
                .find('.wp-manga-chapter')
                .first()
                .find('a')
                .text()
                .trim()
            const chapterNumber = chapterNumberElement
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
            this.lastChapter.url = latestChapterElement.find('a').attr('href')

            // Get the release date of the latest chapter
            this.lastChapter.date = latestChapterElement
                .find('.chapter-release-date')
                .first()
                .find('i')
                .text()
                .trim()

            // Return the scraped data
            // console.log('Data scraped successfully')
            return this
        } catch (error) {
            console.error('Error while scraping Harimanga: ', error)
            throw error
        }
    }
}
