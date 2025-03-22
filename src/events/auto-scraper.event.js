import { consola } from 'consola'
import { Events } from 'discord.js'
import UpdateChecker from '../services/update-cheker.service.js'
import { GUILD_ID, COLORS } from '../config.js'
import { createUpdateEmbed } from '../templates/embeds.template.js'

export default {
    name: Events.ClientReady,

    async execute(client) {
        this.heckUpdatesAndNotify(client)
    },
    async heckUpdatesAndNotify(client) {
        try {
            const updates = await UpdateChecker.checkUpdates() // Assuming this returns the array of updates

            const guild = client.guilds.cache.get(GUILD_ID)

            if (guild) {
                const channels = guild.channels.cache

                // Find the 'notifications' channel
                const notificationChannel = channels.find(
                    (channel) =>
                        channel.type === 0 && channel.name === 'notifications',
                )

                if (notificationChannel) {
                    // If updates are found, send them as embeds
                    if (updates && updates.length > 0) {
                        for (const update of updates) {
                            const updateEmbed = createUpdateEmbed(update)

                            // Send the embed to the notifications channel
                            await notificationChannel.send({
                                embeds: [updateEmbed],
                            })
                        }
                    }
                } else {
                    // If the 'notifications' channel doesn't exist, send the warning embed to all text channels
                    for (const channel of channels.values()) {
                        if (channel.type === 0) {
                            const warningEmbed = {
                                title: '⚠️ Aviso: Canal de Notificações Não Encontrado',
                                description:
                                    'Erro ao verificar atualizações. Para receber as atualizações, crie um canal chamado **"notifications"** no seu servidor do Discord.',
                                color: COLORS.WARNING, // Orange color for warnings
                                fields: [
                                    {
                                        name: 'Como Resolver',
                                        value: '1. Clicar no ícone "+" ao lado de "Canais de Textos".\n2. Selecione o tipo "Canal de Texto".\n3. No local de "Nome do Canal", digite "notifications"\n4. Clicar em "Criar Canal".',
                                        inline: false,
                                    },
                                ],
                                footer: {
                                    text: 'Se o problema persistir, entre em contato com o suporte.',
                                },
                                timestamp: new Date().toISOString(),
                            }
                            await channel.send({ embeds: [warningEmbed] })
                            consola.warn(
                                `Channel ${channel.name} is not the notifications channel`,
                            )
                        }
                    }
                }
            } else {
                consola.error('Guild not found')
            }
        } catch (error) {
            console.error('Erro ao verificar atualizações:', error)
        }
        // Agenda a próxima execução após 10 segundos
        setTimeout(() => this.heckUpdatesAndNotify(client), 1000 * 60 * 30) // 30 minutes
    }, // Runs every 10 seconds
}
