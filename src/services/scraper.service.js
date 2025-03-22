import { ScrapedReadsData } from '../models/scraped-reads-data.model.js'
import SiteAScraper from '../scrapers/site-A.scraper.js'
import SiteBScraper from '../scrapers/site-B.scraper.js'

const siteA = ['harimanga.com', 'harimanga.me']
const siteB = ['bato.to', 'mangatoto.com', 'mto.to', 'batotoo.com']

// Instancia srapedData localmente
const srapedData = new ScrapedReadsData()

// Mapeamento de sites para scrapers
const scraperMap = {
    siteA: { domains: siteA, Scraper: SiteAScraper },
    siteB: { domains: siteB, Scraper: SiteBScraper },
}

// Função para selecionar o scraper
const scraperSelector = (url) => {
    for (const [siteKey, { domains, Scraper }] of Object.entries(scraperMap)) {
        if (domains.some((domain) => url.includes(domain))) {
            return new Scraper(url)
        }
    }
    throw new Error(
        `No scraper available for this site: ${url}. Available scrapers: ${Object.keys(
            scraperMap,
        ).join(', ')}`,
    )
}

export const scrapeUrl = async (url) => {
    try {
        // console.log('Scraping URL:', url)
        const scraper = scraperSelector(url)

        if (!scraper) {
            throw new Error('No scraper available for this site')
        }

        const data = await scraper.scrape()

        return data
    } catch (error) {
        console.error('Error scraping URL:', error)
    }
}
export const scrapeAllSites = async () => {
    try {
        const sitesToScrape = await srapedData.getAllUrls()

        if (!sitesToScrape || sitesToScrape.length === 0) {
            console.error('No sites to scrape')
            return
        }

        // Cria um array de promises para processar todas as URLs simultaneamente
        const scrapePromises = sitesToScrape.map(async (site) => {
            try {
                const data = await scrapeUrl(site.url)
                return { _id: site._id, url: site.url, data: data }
            } catch (error) {
                console.error(`Error scraping URL ${site.url}:`, error)
                return {
                    _id: site._id,
                    url: site.url,
                    data: null,
                    error: error.message,
                }
            }
        })

        // Aguarda todas as promises serem resolvidas
        const allData = await Promise.all(scrapePromises)

        return allData
    } catch (error) {
        console.error('Error in scrapeAllSites:', error)
        throw error
    }
}
