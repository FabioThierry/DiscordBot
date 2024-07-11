import { Events } from 'discord.js'
import chalk from 'chalk'
import { consola } from 'consola'
import { GUILD_ID } from '../config.js'

export default {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        consola.success(chalk.greenBright(`Logged in as ${client.user.tag}!`))

        // Register commands
        client.commandHandler.registerGuildCommands(GUILD_ID)

        // Unregister ping command
        // client.commandHandler.unregisterGuildCommand(
        //     GUILD_ID,
        //     '1169332148763893860',
        // )
    },
}
