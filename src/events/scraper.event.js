import { Events } from 'discord.js'
import { consola } from 'consola'

import { client } from '../index.js'
import { scraperUrl } from '../services/webscraping/scraperService.js'
import ScrapedReadsData from '../db/models.js'

const srapedData = new ScrapedReadsData()

async function checkWebnovel(webnovel) {
    const latestChapter = await scraperUrl(webnovel.url)

    if (webnovel.lastChapter.url !== latestChapter.lastChapter.url) {
        webnovel.lastChapter = latestChapter.lastChapter
        const updatedData = await srapedData.updateData(webnovel._id, webnovel)

        return { updatedData }
    } else {
        return { webnovel }
    }
}

async function sendNotification(updatedData) {
    const channel = await client.channels.fetch(updatedData.channelId)

    if (channel) {
        await channel.send(
            `New chapter for ${updatedData.title}:\n${updatedData.lastChapter.url}`,
        )
        console.log(`Sent new chapter message to ${updatedData.channelId}.`)
    } else {
        console.error(`Channel ${updatedData.channelId} not found.`)
    }
}

const checkForUpdates = async () => {
    try {
        consola.log('Verificando novos capítulos...')
        const scrapers = await srapedData.getAllData()

        if (scrapers) {
            for (const scraper of scrapers) {
                const { updatedData, scraper: updatedWebnovel } =
                    await checkWebnovel(scraper)
                if (updatedData) {
                    await sendNotification(updatedData)
                } else {
                    console.log(
                        `No new chapters found for ${updatedWebnovel.title}.`,
                    )
                }
            }
        } else {
            consola.log('Nenhum novo capítulo encontrado')
        }
    } catch (error) {
        consola.error(error)
    }
}

setInterval(checkForUpdates, 1000 * 60 * 60)

export default {
    name: Events.ClientReady,
    once: true,
    async execute() {
        consola.info('Bot is ready!')
    },
}
