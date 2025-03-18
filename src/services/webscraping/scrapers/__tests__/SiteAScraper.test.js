import { describe, it, expect, vi } from 'vitest'
import SiteAScraper from '../SiteAScraper.js'
import DataScraperFetcher from '../DataScraperFetcher.js'
import axios from 'axios'
import fs from 'fs'
import path from 'path'

vi.mock('axios')

describe('SiteAScraper', () => {
    it('should scrape data successfully', async () => {
        // Lendo o arquivo HTML da pasta __mock__
        const htmlPath = path.resolve(__dirname, '__mock__/harimanga.html')

        const htmlContent = fs.readFileSync(htmlPath, 'utf-8').trim()

        const testUrl = 'http://harimanga.me/manga/into-the-light-once-again/'

        // Simulando a resposta do axios
        axios.get.mockResolvedValue({ data: htmlContent })

        const scraper = new SiteAScraper(testUrl)
        const result = await scraper.scrape()

        expect(result.title).toBe('Into the light once again')
        expect(result.img).toBe(
            'https://harimanga.me/wp-content/uploads/2021/09/Into-the-light-once-again-hari-1-193x278.jpg',
        )
        expect(result.lastChapter.title).toBe('Chapter 98')
        expect(result.lastChapter.number).toBe(98)
        expect(result.lastChapter.url).toBe(
            'https://harimanga.me/manga/into-the-light-once-again/chapter-98/',
        )
        expect(result.lastChapter.date).toBe('New Chapter')
    })
    it('should scrape data successfully 2', async () => {
        // Lendo o arquivo HTML da pasta __mock__
        const htmlPath = path.resolve(__dirname, '__mock__/harimanga2.html')

        const htmlContent = fs.readFileSync(htmlPath, 'utf-8').trim()

        const testUrl = 'https://harimanga.me/manga/princess-shu/'

        // Simulando a resposta do axios
        axios.get.mockResolvedValue({ data: htmlContent })

        const scraper = new SiteAScraper(testUrl)
        const result = await scraper.scrape()

        expect(result.title).toBe('Princess Shu')
        expect(result.img).toBe(
            'https://harimanga.me/wp-content/uploads/2021/11/Princess-Shu-1-193x278.jpg',
        )
        expect(result.lastChapter.title).toBe('Chapter 115')
        expect(result.lastChapter.number).toBe(115)
        expect(result.lastChapter.url).toBe(
            'https://harimanga.me/manga/princess-shu/chapter-115/',
        )
        expect(result.lastChapter.date).toBe('March 9, 2025')
    })
    it('should scrape data successfully 3', async () => {
        // Lendo o arquivo HTML da pasta __mock__
        const htmlPath = path.resolve(__dirname, '__mock__/harimanga3.html')

        const htmlContent = fs.readFileSync(htmlPath, 'utf-8').trim()

        const testUrl = 'https://harimanga.me/manga/princess-shu/'

        // Simulando a resposta do axios
        axios.get.mockResolvedValue({ data: htmlContent })

        const scraper = new SiteAScraper(testUrl)
        const result = await scraper.scrape()

        expect(result.title).toBe('For My Lost Love')
        expect(result.img).toBe(
            'https://harimanga.me/wp-content/uploads/2022/05/For-My-Abandoned-Love-HARI-193x278.jpg',
        )
        expect(result.lastChapter.title).toBe('Chapter 95')
        expect(result.lastChapter.number).toBe(95)
        expect(result.lastChapter.url).toBe(
            'https://harimanga.me/manga/for-my-abandoned-love/chapter-95/',
        )
        expect(result.lastChapter.date).toBe('July 24, 2024')
    })

    it('should throw an error if no latest chapter is found', async () => {
        // Mock de um HTML sem capítulo
        const mockHtml = `
         <div class="post-title"><h1>Mock Title</h1></div>
         <div class="summary_image"><img src="http://example.com/image.jpg" /></div>
       `

        const testUrl =
            'http://harimanga.me/manga/into-the-light-once-again/chapter-98/'

        // Simulando a resposta do axios com um HTML sem capítulos
        axios.get.mockResolvedValue({ data: mockHtml })

        const scraper = new SiteAScraper(testUrl)

        // Espera-se que o scraper lance um erro porque não há capítulos
        await expect(scraper.scrape()).rejects.toThrow(
            'No latest chapter found',
        )
    })

    it('should throw an error if chapter number is invalid', async () => {
        // Mock HTML structure
        const mockHtml = `
       <div class="post-title"><h1>Mock Title</h1></div>
       <div class="summary_image"><img src="http://example.com/image.jpg" /></div>
       <div class="main">
         <div class="wp-manga-chapter">
           <a href="http://example.com/chapter-1">Chapter One</a>
         </div>
         <div class="chapter-release-date"><i>2025-03-15</i></div>
       </div>
     `
        const testUrl =
            'http://harimanga.me/manga/into-the-light-once-again/chapter-98/'

        // Mock fetchData method to return empty main
        axios.get.mockResolvedValue({ data: mockHtml })

        const scraper = new SiteAScraper(testUrl)

        await expect(scraper.scrape()).rejects.toThrow('Invalid chapter number')
    })
})
