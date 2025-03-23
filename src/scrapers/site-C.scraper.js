import HtmlParser from '../utils/html-parser.util.js'
import HttpHelper from '../utils/http-helper.util.js'

export default class SiteCScraper {
    constructor(url) {
        this.url = url
        this.title = ''
        this.img = ''
        this.lastChapter = {
            title: '',
            url: '',
            number: 0,
            date: '',
        }
        this.lastCheckedDate = new Date()
    }
    async scrape() {
        try {
            const html = await HttpHelper.fetchPage(this.url)

            this.title = HtmlParser.extractText(
                html,
                `body > div.queen > div > div > div.row > div.col-md-12.col-lg-7 > div > h2`,
            )
            this.img = HtmlParser.extractImageDataSrc(
                html,
                `body > div.queen > div.container > div.boxvb1.padd12 > div.row > div.col-md-12.col-lg-5 > div.imagboca1 > img`,
            )
            this.lastChapter.title = HtmlParser.extractText(
                html,
                `#chapter > ul > li:last-child  > span > a`,
            )

            this.lastChapter.url = HtmlParser.extractImageAnchor(
                html,
                `#chapter > ul > li:last-child  > span > a`,
            )

            this.lastChapter.number = HtmlParser.extractNearestNumber(
                html,
                `#chapter > ul > li:last-child  > span > a`,
                'Chapter',
            )
            this.lastChapter.date = HtmlParser.extractText(
                html,
                `#chapter > ul > li:last-child > small`,
            )
            this.lastChapter.date = '' ? 'New Chapter' : this.lastChapter.date

            return this
        } catch (error) {
            console.error('Error scraping data:', error)
            throw error
        }
    }
}
