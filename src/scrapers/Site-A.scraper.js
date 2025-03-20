import HtmlParser from '../utils/html-parser.util.js'
import HttpHelper from '../utils/http-helper.util.js'

export default class SiteAScraper {
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
                `body > div.wrap > div > div > div > div.profile-manga.summary-layout-1 > div > div > div > div.post-title > h1`,
            )
            this.img = HtmlParser.extractImage(
                html,
                `body > div.wrap > div > div > div > div.profile-manga.summary-layout-1 > div > div > div > div.tab-summary > div.summary_image > a > img`,
            )
            this.lastChapter.title = HtmlParser.extractText(
                html,
                `body > div.wrap > div > div > div > div.c-page-content.style-1 > div > div > div > div.main-col.col-md-8.col-sm-8 > div > div.c-page > div > div.page-content-listing.single-page > div > ul > li:nth-child(1) > a`,
            )
            this.lastChapter.url = HtmlParser.extractLink(
                html,
                `body > div.wrap > div > div > div > div.c-page-content.style-1 > div > div > div > div.main-col.col-md-8.col-sm-8 > div > div.c-page > div > div.page-content-listing.single-page > div > ul > li:nth-child(1) > a`,
            )
            this.lastChapter.number = HtmlParser.extractNearestNumber(
                html,
                `body > div.wrap > div > div > div > div.c-page-content.style-1 > div > div > div > div.main-col.col-md-8.col-sm-8 > div > div.c-page > div > div.page-content-listing.single-page > div > ul > li:nth-child(1) > a`,
                'Chapter',
            )
            this.lastChapter.date = HtmlParser.extractText(
                html,
                `body > div.wrap > div > div > div > div.c-page-content.style-1 > div > div > div > div.main-col.col-md-8.col-sm-8 > div > div.c-page > div > div.page-content-listing.single-page > div > ul > li:nth-child(1) > span`,
            )

            this.lastChapter.date = this.lastChapter.date
                ? this.lastChapter.date
                : 'New Chapter'
            return this
        } catch (error) {
            console.error('Error scraping data:', error)
            throw error
        }
    }
}
