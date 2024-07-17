import { consola } from 'consola'
import { Client, GatewayIntentBits } from 'discord.js'
import packageJson from '../package.json' assert { type: 'json' }
import CommandHandler from './CommandHandler.js'
import EventHandler from './EventHandler.js'
import AntiCrash from './utils/anti-crash.util.js'
import { TOKEN, DISCORD_BOT_DATABASE } from './config.js'
import mongoose from 'mongoose'

import ScrapedReadsData from './models/ScrapedReadsDataModel.js'
import scrapeWebnovel from './services/webscraping/scraperService.js'

const scrapedReadsDataInstance = new ScrapedReadsData()

// Init database
main()
    .then(() => {
        consola.log('Conecxão realizada com sucesso')
    })
    .catch((err) =>
        consola.error('Houve um erro ao conectar ao Banco de dados' + err),
    )
async function main() {
    await mongoose.connect(DISCORD_BOT_DATABASE)
    const checkForNewChapter = async () => {
        try {
            consola.log('Verificando novos capítulos...')
            const scraper = await scrapedReadsDataInstance.getAllData()
            if (scraper) {
                for (const webnovel of scraper) {
                    const latestChapter = await scrapeWebnovel(webnovel.url)
                    if (
                        webnovel.lastChapter.number !==
                        latestChapter.lastChapter.number
                    ) {
                        webnovel.lastChapter = latestChapter.lastChapter
                        const updatedData =
                            await scrapedReadsDataInstance.updateData(
                                webnovel._id,
                                webnovel,
                            )
                        consola.log('Novo capítulo encontrado!')
                        const channel = await client.channels.fetch(
                            updatedData.channelId,
                        )
                        if (channel) {
                            await channel.send(
                                `New chapter for ${updatedData.title}:\n${updatedData.lastChapter.url}`,
                            )
                            console.log(
                                `Sent new chapter message to ${updatedData.channelId}.`,
                            )
                        } else {
                            console.error(
                                `Channel ${updatedData.channelId} not found.`,
                            )
                        }
                    } else {
                        console.log(
                            `No new chapters found for ${webnovel.title}.`,
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

    setInterval(checkForNewChapter, 1000 * 60 * 60)
}

// Anti bot crash system
AntiCrash.init()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})

// Handlers
const commandHandler = new CommandHandler(client)
const eventHandler = new EventHandler(client)

consola.start(`Starting app '${packageJson.name}'`)
consola.box(`Author:  ${packageJson.author}\nVersion: ${packageJson.version}`)

// Register commands
await Promise.all([
    // Utils
    commandHandler.loadCommand('./commands/utils/ping.command'),
    commandHandler.loadCommand('./commands/utils/info.command'),
    commandHandler.loadCommand('./commands/utils/embed.command'),
    commandHandler.loadCommand('./commands/utils/help.command'),
    // Admin
    commandHandler.loadCommand('./commands/admin/ban.command'),
    commandHandler.loadCommand('./commands/admin/unban.command'),
    commandHandler.loadCommand('./commands/admin/kick.command'),
    commandHandler.loadCommand('./commands/admin/purge.command'),
    // Games
    commandHandler.loadCommand('./commands/games/coin-flip.command'),
    // Scrapers
    commandHandler.loadCommand('./commands/scrapers/scraper-add.command'),
])

commandHandler.displayLoadedCommands()

// Add handlers to the client
client.commandHandler = commandHandler
client.eventHandler = eventHandler

// Login bot
client.login(TOKEN)
