import SiteAScraper from '../services/webscraping/scrapers/SiteBScraper.js'
import SiteBScraper from '../services/webscraping/scrapers/SiteBScraper.js'
// Todo a resposabilidade está sendo compartilhada, isso pode ser melhorado
const siteA = ['harimanga.com', 'harimanga.me']
const siteB = ['bato.to', 'mangatoto.com', 'mto.to', 'batotoo.com']

export const scraperSelector = (url) => {
    if (siteA.some((site) => url.includes(site))) {
        return new SiteAScraper(url)
    } else if (siteB.some((site) => url.includes(site))) {
        return new SiteBScraper(url)
    } else {
        throw new Error('No scraper available for this site ' + url)
    }
}

// switch (true) {
//     case siteA.some((site) => {
//         if (url.includes(site)) {
//             console.log(`Scraping Site A using ${site} ${url}`)
//             return new SiteAScraper(url)
//         }
//     }):
//     case siteB.some((site) => {
//         if (url.includes(site)) {
//             console.log(`Scraping Site B using ${site} ${url}`)
//             return new SiteBScraper(url)
//         }
//     }):
//     default:
//         throw new Error('No scraper available for this site ' + url)
// }
// // Check if URL should use Site A scraper
// for (const site of siteA) {
//     if (url.includes(site)) {
//         return new SiteAScraper(url)
//     }
// }

// // Check if URL should use Site B scraper
// for (const site of siteB) {
//     if (url.includes(site)) {
//         return new SiteBScraper(url)
//     }
// }
