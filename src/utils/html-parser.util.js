// utils/htmlParser.js
import * as cheerio from 'cheerio'

class HtmlParser {
    static load(html) {
        return cheerio.load(html)
    }
    /**
     * Extrai todos os links de uma página HTML.
     * @param {string} html - O conteúdo HTML da página.
     * @returns {string[]} - Uma lista de URLs.
     */
    static extractLink(html, selector) {
        const $ = cheerio.load(html)
        return $(selector).attr('href')
    }

    /**
     * Extrai o texto de um elemento específico usando um seletor CSS.
     * @param {string} html - O conteúdo HTML da página.
     * @param {string} selector - O seletor CSS do elemento.
     * @returns {string} - O texto do elemento.
     */
    static extractText(html, selector) {
        const $ = cheerio.load(html)
        return $(selector).text().trim()
    }

    /**
     * Extrai todos os elementos de uma lista usando um seletor CSS.
     * @param {string} html - O conteúdo HTML da página.
     * @param {string} selector - O seletor CSS dos elementos.
     * @returns {string[]} - Uma lista de textos dos elementos.
     */
    static extractList(html, selector) {
        const $ = cheerio.load(html)
        const items = []
        $(selector).each((index, element) => {
            items.push($(element).text().trim())
        })
        return items
    }
    /**
     * Extrai a imagem de um elemento usando um seletor CSS.
     * @param {string} html - O conteúdo HTML da página.
     * @param {string} selector - O seletor CSS do elemento.
     * @returns {string} - A URL da imagem.
     *  */
    static extractImage(html, selector) {
        const $ = cheerio.load(html)
        const image = $(selector).attr('src')
        return image
    }
    /**
     * Extrai o número mais próximo de um elemento usando um seletor CSS e uma palavra-chave.
     * @param {string} html - O conteúdo HTML da página.
     * @param {string} selector - O seletor CSS do elemento.
     * @param {string} keyword - A palavra-chave para extrair o número.
     * @returns {number} - O número mais próximo.
     *  */
    static extractNearestNumber(html, selector, keyword) {
        const $ = cheerio.load(html)
        const _text = $(selector).text().trim()

        // Regex para capturar o número mais próximo da palavra-chave
        const regex = new RegExp(`(?:${keyword}\\D*)(\\d+(?:\\.\\d+)?)`, 'gi')
        let match
        let nearestNumber = null

        // Itera sobre todas as correspondências da regex no texto
        while ((match = regex.exec(_text)) !== null) {
            // Captura o número mais próximo da palavra-chave
            if (match[1]) {
                nearestNumber = parseFloat(match[1])
                break // Para após encontrar o primeiro número válido
            }
        }

        return nearestNumber
    }
}

export default HtmlParser
