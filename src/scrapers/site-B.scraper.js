import HtmlParser from '../utils/html-parser.util.js'
import HttpHelper from '../utils/http-helper.util.js'

export default class SiteBScraper {
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
                `#mainer > div.container-fluid.container-max-width-xl > div.mt-4.d-flex.justify-content-between.title-set > h3`,
            )
            this.img = HtmlParser.extractImage(
                html,
                `#mainer > div.container-fluid.container-max-width-xl > div.row.detail-set > div.col-24.col-sm-8.col-md-6.attr-cover > img`,
            )
            this.lastChapter.title = HtmlParser.extractText(
                html,
                `#mainer > div.container-fluid.container-max-width-xl > div.mt-4.episode-list > div.main > div:nth-child(1) > a > b`,
            )

            this.lastChapter.url = HtmlParser.extractLink(
                html,
                `#mainer > div.container-fluid.container-max-width-xl > div.mt-4.episode-list > div.main > div:nth-child(1) > a`,
            )
            this.lastChapter.url =
                new URL(this.url).hostname + this.lastChapter.url

            this.lastChapter.number = HtmlParser.extractNearestNumber(
                html,
                `#mainer > div.container-fluid.container-max-width-xl > div.mt-4.episode-list > div.main > div:nth-child(1) > a > b`,
                'Chapter',
            )
            this.lastChapter.date = HtmlParser.extractText(
                html,
                `#mainer > div.container-fluid.container-max-width-xl > div.mt-4.episode-list > div.main > div:nth-child(1) > div > i`,
            )
            this.lastChapter.date = '' ? 'New Chapter' : this.lastChapter.date

            return this
        } catch (error) {
            console.error('Error scraping data:', error)
            throw error
        }
    }
}
