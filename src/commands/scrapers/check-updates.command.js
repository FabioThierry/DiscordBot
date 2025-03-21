import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import UpdateChecker from '../../services/update-cheker.service.js' // Supondo que você tenha um serviço para verificar atualizações
import { ScrapedReadsData } from '../../models/Scraped-reads-data.model.js'

const scrapedReadsDataInstance = new ScrapedReadsData()

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
                    const updateEmbed = new EmbedBuilder()
                        .setColor('#00ff00') // Verde para sucesso
                        .setTitle(
                            `📚 Novo Capítulo Disponível: ${update.newData.title}`,
                        )
                        .setDescription(
                            `Um novo capítulo de **${update.newData.title}** foi lançado! Confira os detalhes abaixo.`,
                        )
                        .addFields(
                            {
                                name: '📖 Capítulo',
                                value: `**${update.newData.lastChapter.number} - ${update.newData.lastChapter.title}**`,
                                inline: true,
                            },
                            {
                                name: '📅 Data',
                                value: `${update.newData.lastChapter.date}`,
                                inline: true,
                            },
                            {
                                name: '🔗 Link do Capítulo',
                                value: `[Clique aqui para ler](${update.newData.lastChapter.url})`,
                                inline: false,
                            },
                            {
                                name: '🌐 Série',
                                value: `[Visitar página da série](${update.url})`,
                                inline: false,
                            },
                        )
                        .setThumbnail(update.newData.img) // Thumbnail da série
                        .setFooter({
                            text: `Última verificação: ${new Date(
                                update.newData.lastCheckedDate,
                            ).toLocaleString()}`,
                        })
                        .setTimestamp()

                    // Envia o embed para o canal
                    await interaction.followUp({ embeds: [updateEmbed] })
                }
            } else {
                // Se não houver atualizações
                const noUpdatesEmbed = new EmbedBuilder()
                    .setColor('#ffff00') // Amarelo para aviso
                    .setTitle('⚠️ Nenhuma Atualização Encontrada')
                    .setDescription(
                        'Não foram encontradas novas atualizações no momento.',
                    )
                    .setFooter({
                        text: 'Comando: check-updates',
                        iconURL: 'https://example.com/icon.png',
                    })
                    .setTimestamp()

                await interaction.followUp({ embeds: [noUpdatesEmbed] })
            }
        } catch (error) {
            console.error('Erro ao verificar atualizações:', error)

            // Embed de erro
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000') // Vermelho para erro
                .setTitle('❌ Erro ao Verificar Atualizações')
                .setDescription(
                    'Ocorreu um erro ao tentar verificar as atualizações. Por favor, tente novamente mais tarde.',
                )
                .setFooter({
                    text: 'Comando: check-updates',
                    iconURL: 'https://example.com/icon.png',
                })
                .setTimestamp()

            await interaction.followUp({ embeds: [errorEmbed] })
        }
    },
}
