import { consola } from 'consola'
import { Client, GatewayIntentBits } from 'discord.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const packageJson = require('../package.json')
import CommandHandler from './CommandHandler.js'
import EventHandler from './EventHandler.js'
import AntiCrash from './utils/anti-crash.util.js'
import { TOKEN } from './config.js'
import db from './db.js'

import keep_alive from './keep_alive.js'

// Database connection
db.connect()

// Anti bot crash system
AntiCrash.init()
export const client = new Client({
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
    commandHandler.loadCommand('./commands/games/dices.command'),
    // Scrapers
    commandHandler.loadCommand('./commands/scrapers/scraper-add.command'),
    commandHandler.loadCommand('./commands/scrapers/check-updates.command'),
    commandHandler.loadCommand('./commands/scrapers/list-scrapers.command'),
    commandHandler.loadCommand('./commands/scrapers/delete-scraper.command'),
])

commandHandler.displayLoadedCommands()

// Add handlers to the client
client.commandHandler = commandHandler
client.eventHandler = eventHandler

// Login bot
client.login(TOKEN)
