const siteA = {
    domains: ['siteA.com', 'siteAvariant.com', 'anotherSiteA.com'],
    scraper: () => import('../services/webscraping/scrapers/siteAScraper'),
}
const siteB = {
    domains: ['siteB.com'],
    scraper: () => import('../services/webscraping/scrapers/siteBScraper'),
}

export const siteConfig = { siteA, siteB }
