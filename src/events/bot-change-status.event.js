import { consola } from 'consola'
import { ActivityType, Events } from 'discord.js'
import { BOT_STATUS_ENABLED, BOT_STATUS_INTERVAL } from '../config.js'

const activities = [
    {
        type: ActivityType.Listening,
        name: 'customstatus',
        state: 'Ouvindo Musga',
    },

    {
        type: ActivityType.Playing,
        name: 'Minecraft',
        state: 'Jogando um Minezinho',
    },
    {
        type: ActivityType.Watching,
        name: 'YouTube',
        state: 'assistindo um vídeo no YouTube.',
    },
    {
        type: ActivityType.Streaming,
        name: 'Twitch',
        state: 'Fazendo live no Twitch.',
        url: 'https://www.twitch.tv/',
    },
]

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        if (!BOT_STATUS_ENABLED) {
            // Clear status
            client.user.setPresence({ activity: null })
            return
        }

        if (BOT_STATUS_INTERVAL > 0) {
            if (BOT_STATUS_INTERVAL < 10) {
                consola.warn(
                    `The value BOT_STATUS_INTERVAL = ${BOT_STATUS_INTERVAL} is less than 10. The status change may not work correctly!`,
                )
            }
            return this.initRefreshing(client)
        }

        // Change bot status
        await client.user.setStatus('online')

        consola.success('Bot status changed successfully.')
    },

    async initRefreshing(client) {
        consola.info(
            `Started cycling status change of the bot (every ${BOT_STATUS_INTERVAL} seconds).`,
        )

        let i = 0

        setInterval(() => {
            // Reset activities
            if (i >= activities.length) i = 0

            const myActivity = activities[i]

            const activity = {
                type: myActivity.type,
                name: myActivity.name,
                state: myActivity.state,
            }

            if (myActivity.type === ActivityType.Streaming) {
                activity.url = myActivity.url
            }

            client.user.setPresence({
                activities: [activity],

                status: 'online',
            })

            i++
        }, BOT_STATUS_INTERVAL * 1000)
    },
}
