import { ScrapedReadsData } from '../models/Scraped-reads-data.model.js'
import { scrapeAllSites } from './scraper.service.js'

export default class UpdateChecker {
    static async checkUpdates() {
        const updates = []
        const scrapedData = new ScrapedReadsData()

        try {
            const scrapedResults = await scrapeAllSites()

            if (!scrapedResults) {
                console.error('No sites to scrape')
                return
            }

            for (const result of scrapedResults) {
                const { _id, url, data } = result

                // 1. Recuperar os dados atuais do banco de dados
                const currentData = await scrapedData.getDataById(_id)

                if (!currentData) {
                    console.error(`Dados não encontrados para o ID: ${_id}`)
                    continue
                }

                // 2. Comparar os dados antigos com os novos
                const hasChanges = this.compareData(currentData, data)

                if (hasChanges) {
                    // 3. Atualizar o banco de dados apenas se houver diferenças
                    const updatedData = await scrapedData.updateData(_id, data)

                    if (updatedData) {
                        // console.log('Dados atualizados:', updatedData)
                        // 4. Adicionar os dados atualizados ao array `updates`
                        updates.push({
                            id: _id,
                            url: url,

                            newData: updatedData,
                        })
                    }
                }
            }
            return updates
        } catch (error) {
            console.error('Erro ao verificar atualizações:', error)
            throw error
        }
    }
    // Método para comparar os dados antigos com os novos
    static compareData(oldData, newData) {
        // Verificar se o último capítulo foi atualizado
        const isLastChapterUrlUpdated =
            oldData.lastChapter.url !== newData.lastChapter.url

        const isLastChapterNumberUpdated =
            oldData.lastChapter.number !== newData.lastChapter.number

        const isLastChapterTitleUpdated =
            oldData.lastChapter.title !== newData.lastChapter.title

        // Verificar se a imagem foi atualizada
        const isImgUpdated = oldData.img !== newData.img

        // Verificar se a data de verificação foi atualizada
        const isUrlUpdated = oldData.url !== newData.url

        // Retornar true se qualquer um dos campos relevantes foi atualizado
        return (
            isLastChapterUrlUpdated ||
            isLastChapterNumberUpdated ||
            isLastChapterTitleUpdated ||
            isImgUpdated ||
            isUrlUpdated
        )
    }
}
