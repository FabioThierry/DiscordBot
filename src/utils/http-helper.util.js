// utils/httpHelper.js
import axios from 'axios'

class HttpHelper {
    /**
     * Faz uma requisição GET para uma URL e retorna o conteúdo da página.
     * @param {string} url - A URL para fazer a requisição.
     * @param {object} headers - Headers personalizados (opcional).
     * @returns {Promise<string>} - O conteúdo da página.
     */
    static async fetchPage(url, headers = {}) {
        try {
            const parsedUrl = new URL(url)
            const response = await axios.get(parsedUrl, {
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                    ...headers,
                },
            })
            return response.data // Retorna o HTML da página
        } catch (error) {
            console.error(`Erro ao buscar a página ${url}:`, error.message)
            throw error
        }
    }
    /**
     * Faz uma requisição HEAD para uma URL e retorna a URL atualizada.
     * @param {string} url - A URL para fazer a requisição.
     * @returns {Promise<string>} - A URL atualizada.
     * @throws {Error} - Se a URL for inválida.
     * */
    static async updateUrl(url) {
        try {
            const response = await axios.head(url)
            if (response.status === 200) {
                return response.request.res.responseUrl
            }
            return url
        } catch (error) {
            return url
        }
    }
}

export default HttpHelper
