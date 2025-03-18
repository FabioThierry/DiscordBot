import { describe, it, expect, vi } from 'vitest'
import SiteBScraper from '../SiteBScraper.js'
import axios from 'axios'
import fs from 'fs'
import path from 'path'

vi.mock('axios')

describe('SiteAScraper', () => {
    it('should scrape data successfully 1 ', async () => {
        // Lendo o arquivo HTML da pasta __mock__
        const htmlPath = path.resolve(__dirname, '__mock__/batoto.html')

        const htmlContent = fs.readFileSync(htmlPath, 'utf-8').trim()

        const testUrl = 'https://bato.to/series/132934/'
        // Simulando a resposta do axios
        axios.get.mockResolvedValue({ data: htmlContent })

        const scraper = new SiteBScraper(testUrl)
        const result = await scraper.scrape()

        expect(result.title).toBe('Firefly Wedding [𝙾𝚏𝚏𝚒𝚌𝚒𝚊𝚕]')
        expect(result.img).toBe(
            'https://n10.mbhiz.org/thumb/W600/ampi/142/1427e9763211f72be8e9a2f7f93e23d993f1c8b8_640_954_402312.jpeg',
        )
        expect(result.lastChapter.title).toBe('TEMPORARY')
        expect(result.lastChapter.number).toBe(56)
        expect(result.lastChapter.url).toBe('bato.to/chapter/3227046')
        expect(result.lastChapter.date).toBe('New Chapter')
    })

    it('should scrape data successfully 2 ', async () => {
        // Lendo o arquivo HTML da pasta __mock__
        const htmlPath = path.resolve(__dirname, '__mock__/batoto2.html')

        const htmlContent = fs.readFileSync(htmlPath, 'utf-8').trim()

        const testUrl = 'https://batotoo.com/series/160852'
        // Simulando a resposta do axios
        axios.get.mockResolvedValue({ data: htmlContent })

        const scraper = new SiteBScraper(testUrl)
        const result = await scraper.scrape()

        expect(result.title).toBe('Ayashii Iyashi no Yakumo-san')
        expect(result.img).toBe(
            'https://n06.mbwnp.org/thumb/W600/ampi/547/54786786ec2f7bc26f36de9719eab38a0a291435_695_1000_145475.jpeg',
        )
        expect(result.lastChapter.title).toBe(
            'A surprise attack from the older guy who seems to be a player',
        )
        expect(result.lastChapter.number).toBe(21)
        expect(result.lastChapter.url).toBe('batotoo.com/chapter/3190083')
        expect(result.lastChapter.date).toBe('New Chapter')
    })

    // it('should throw an error if no latest chapter is found', async () => {
    //     // Mock de um HTML sem capítulo
    //     const mockHtml = `
    //      <div class="post-title"><h1>Mock Title</h1></div>
    //      <div class="summary_image"><img src="http://example.com/image.jpg" /></div>
    //    `

    //     const testUrl = 'https://bato.to/series/132934/'

    //     // Simulando a resposta do axios com um HTML sem capítulos
    //     axios.get.mockResolvedValue({ data: mockHtml })

    //     const scraper = new SiteBScraper(testUrl)

    //     // Espera-se que o scraper lance um erro porque não há capítulos
    //     await expect(scraper.scrape()).rejects.toThrow(
    //         'No latest chapter found',
    //     )
    // })

    // it('should throw an error if chapter number is invalid', async () => {
    //     // Mock HTML structure
    //     const mockHtml = `
    //    <div class="post-title"><h1>Mock Title</h1></div>
    //    <div class="summary_image"><img src="http://example.com/image.jpg" /></div>
    //    <div class="main">
    //      <div class="wp-manga-chapter">
    //        <a href="http://example.com/chapter-1">Chapter One</a>
    //      </div>
    //      <div class="chapter-release-date"><i>2025-03-15</i></div>
    //    </div>
    //  `
    //     const testUrl =
    //         'http://harimanga.me/manga/into-the-light-once-again/chapter-98/'

    //     // Mock fetchData method to return empty main
    //     axios.get.mockResolvedValue({ data: mockHtml })

    //     const scraper = new SiteBScraper(testUrl)

    //     await expect(scraper.scrape()).rejects.toThrow('Invalid chapter number')
    // })
})
