import { Events } from 'discord.js'
import { consola } from 'consola'

// import { client } from '../index.js'
// import { scrapeUrl } from '../services/webscraping/scraperService.js'
// import ScrapedReadsData from '../db/models.js'

// const srapedData = new ScrapedReadsData()

// async function checkWebnovel(webnovel) {
//     console.log('Checking webnovel:', webnovel.url)
//     const latestChapter = await scraperUrl(webnovel.url)
//     if (!latestChapter) {
//         consola.error('No scraper available for this site')
//         return
//     }
//     console.log('Latest chapter:', latestChapter.lastChapter)

//     if (webnovel.lastChapter.url !== latestChapter.lastChapter.url) {
//         webnovel.lastChapter = latestChapter.lastChapter
//         const updatedData = await srapedData.updateData(webnovel._id, webnovel)
//         consola.log('Novo capítulo encontrado!')
//         return { updatedData }
//     } else {
//         consola.info('Nenhum novo capítulo encontrado.')
//         return { webnovel }
//     }
// }

// async function sendNotification(updatedData) {
//     const channel = await client.channels.fetch(updatedData.channelId)

//     if (channel) {
//         await channel.send(
//             `New chapter for ${updatedData.title}:\n${updatedData.lastChapter.url}`,
//         )
//         console.log(`Sent new chapter message to ${updatedData.channelId}.`)
//     } else {
//         console.error(`Channel ${updatedData.channelId} not found.`)
//     }
// }

// const checkForUpdates = async () => {
//     try {
//         consola.log('Verificando novos capítulos...')
//         const scrapers = await srapedData.getAllData()
//         consola.info(`Found ${scrapers.length} webnovels to check.`)
//         // consola.info(`Found ${scrapers.toString()} webnovels to check.`)
//         if (scrapers) {
//             for (const scraper of scrapers) {
//                 consola.info(`Checking ${scraper.title} for new chapters...`)
//                 const { updatedData, scraper: updatedWebnovel } =
//                     await checkWebnovel(scraper)
//                 consola.info(`Checking  for new chapters...`)
//                 if (updatedData) {
//                     await sendNotification(updatedData)
//                 } else {
//                     consola.info(`No new chapters found for .`)
//                 }
//             }
//         } else {
//             consola.info('Nenhum novo capítulo encontrado')
//         }
//     } catch (error) {
//         consola.error(error)
//     }
// }

// setInterval(checkForUpdates, 1000 * 60)
// consola.info(
//     'Intervalo de verificação de novos capítulos definido para 1 minuto.',
// )
// setInterval(checkForUpdates, 1000 * 60 * 60)

export default {
    name: Events.ClientReady,
    once: true,
    async execute() {
        consola.info('Bot is ready!')
    },
}
