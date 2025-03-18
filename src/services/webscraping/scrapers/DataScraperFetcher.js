// src/services/webscraping/scrapers/baseScraper.js
// TODO Refazer como uma Util
import axios from 'axios'
import cheerio from 'cheerio'

class DataScraperFetcher {
    constructor(url) {
        if (this.isValidUrl(url)) {
            this.url = url
        } else {
            throw new Error('Invalid URL')
        }

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

    async updateUrl() {
        try {
            const response = await axios.head(this.url)

            if (response.status === 200) {
                if (response.request.res.responseUrl !== this.url) {
                    this.url = response.request.res.responseUrl
                }
                return this.url
            }
        } catch (error) {
            return this.url
        }
    }
    isValidUrl(url) {
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    async fetchData() {
        try {
            const response = await axios.get(this.url)
            return cheerio.load(response.data)
        } catch (error) {
            throw new Error(`Failed to fetch data from ${this.url}: ${error}`)
        }
    }

    async init() {
        this.url = await this.updateUrl()

        return this
    }
    async scrape() {
        throw new Error('Method not implemented.')
    }
}

export default DataScraperFetcher
