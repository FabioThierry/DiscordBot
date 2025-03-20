import mongoose from 'mongoose'
import consola from 'consola'
import { DISCORD_BOT_DATABASE } from './config.js'

export default {
    connect: async () => {
        try {
            await mongoose.connect(DISCORD_BOT_DATABASE)
            consola.info('The database is connected ✅')
        } catch (error) {
            consola.error('The database is not connected' + error)
        }
    },
}
