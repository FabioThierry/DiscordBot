// src/services/webscraping/scrapers/baseScraper.js
import axios from 'axios'
import cheerio from 'cheerio'

class ReadingScraper {
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

    async fetchData() {
        console.log(`Fetching data from ${this.url}...`)
        const response = await axios.get(this.url)
        console.log('Data fetched successfully.')
        console.log(`Response data length: ${response.data.length}`)
        return cheerio.load(response.data)
    }

    async scrape() {
        throw new Error('Method not implemented.')
    }
}

export default ReadingScraper
