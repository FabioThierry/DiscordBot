import { consola } from 'consola'
import { ActivityType, Events } from 'discord.js'
import { BOT_STATUS_ENABLED, BOT_STATUS_INTERVAL } from '../config.js'

const activities = [
    {
        type: ActivityType.Custom,
        name: 'customstatus',
        state: 'Subscribe to m7rlin | Tutorials for you',
    },

    {
        type: ActivityType.Playing,
        name: 'Minecraft',
        state: 'Playing for 10 minutes.',
    },
    {
        type: ActivityType.Competing,
        name: 'Minecraft',
        state: 'Playing for 10 minutes.',
    },
    {
        type: ActivityType.Streaming,
        name: 'MagicTM Live',
        state: 'Live streaming for 10 minutes.',
        url: 'https://www.magictm.com',
    },
    {
        type: ActivityType.Watching,
        name: 'YT @m7rlin',
        state: 'Watching amazing tutorials by @m7rlin on YouTube.',
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
