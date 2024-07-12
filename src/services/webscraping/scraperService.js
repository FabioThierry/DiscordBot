import SiteAScraper from './scrapers/SiteAScraper.js'
import SiteBScraper from './scrapers/SiteBScraper.js'
// import SiteCScraper from './scrapers/SiteCScraper.js'
// import { addWebnovel } from '../../models/webnovel.model'
// import siteConfig from '../../siteConfig'

const siteA = ['harimanga.com']
const siteB = ['bato.to', 'mangatoto.com', 'mto.to', 'batotoo.com']
const getScraper = (url) => {
    switch (true) {
        case siteA.some((site) => url.includes(site)):
            return new SiteAScraper(url)
        case siteB.some((site) => url.includes(site)):
            return new SiteBScraper(url)
        // case siteC.some((site) => url.includes(site)):
        //     return new SiteCScraper(url)
        default:
            throw new Error('No scraper available for this site')
    }
}

const scrapeWebnovel = async (url) => {
    try {
        const scraper = await getScraper(url)
        console.log('webnovel scraper:', scraper)
        const webnovelData = await scraper.scrape()
        console.log('webnovel data:', webnovelData)
        // addWebnovel(
        //     webnovelData.title,
        //     webnovelData.url,
        //     webnovelData.lastChecked,
        // )
    } catch (error) {
        console.error('Error scraping webnovel:', error)
    }
}

export { scrapeWebnovel }

// scrapeWebnovel('https://bato.to/series/132934/firefly-wedding')
// scrapeWebnovel('https://mangatoto.com/series/77447')
// scrapeWebnovel('https://mto.to/series/99955')
// scrapeWebnovel('https://batotoo.com/series/99395/inazuma-to-romance-official')
// scrapeWebnovel('https://batotoo.com/series/101051')

scrapeWebnovel('https://harimanga.com/manga/i-will-change-the-genre/ ')
