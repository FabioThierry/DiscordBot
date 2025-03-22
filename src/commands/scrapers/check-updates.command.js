import { SlashCommandBuilder } from 'discord.js'

import UpdateChecker from '../../services/update-cheker.service.js'
import {
    createUpdateEmbed,
    createNoUpdatesEmbed,
    createErrorEmbed,
} from '../../templates/embeds.template.js'

export default {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('check-updates')
        .setDescription('Verifica manualmente as atualizações dos scrapers.'),

    async execute(interaction) {
        // Envia uma mensagem inicial informando que a verificação está em andamento
        await interaction.reply({
            content: '🔍 Verificando atualizações...',
            ephemeral: true,
        })

        try {
            // Verifica as atualizações
            const updates = await UpdateChecker.checkUpdates()

            if (updates && updates.length > 0) {
                // Cria um embed para cada atualização
                for (const update of updates) {
                    const updateEmbed = createUpdateEmbed(update)
                    // Envia o embed para o canal
                    await interaction.followUp({ embeds: [updateEmbed] })
                }
            } else {
                // Se não houver atualizações
                const noUpdatesEmbed = createNoUpdatesEmbed()

                await interaction.followUp({ embeds: [noUpdatesEmbed] })
            }
        } catch (error) {
            console.error('Erro ao verificar atualizações:', error)

            // Embed de erro
            const errorEmbed = createErrorEmbed()

            await interaction.followUp({ embeds: [errorEmbed] })
        }
    },
}
