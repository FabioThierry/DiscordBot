import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { ScrapedReadsData } from '../../models/scraped-reads-data.model.js'
import { COLORS, FORMAT_DATETIME } from '../../config.js'

const scrapedReadsDataInstance = new ScrapedReadsData()

export default {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('list-scrapers')
        .setDescription('Lista todos os scrapers cadastrados.'),

    async execute(interaction) {
        // Envia uma mensagem inicial informando que a lista está sendo gerada
        await interaction.reply({
            content: '🔍 Gerando lista de scrapers...',
            ephemeral: true,
        })

        try {
            // Busca todos os scrapers cadastrados
            const scrapers = await scrapedReadsDataInstance.getAllData()

            if (scrapers && scrapers.length > 0) {
                // Divide os scrapers em grupos de 10 (ou outro número)
                const chunkSize = 10 // Número de scrapers por embed
                for (let i = 0; i < scrapers.length; i += chunkSize) {
                    const chunk = scrapers.slice(i, i + chunkSize)

                    // Cria um embed para o grupo atual
                    const listEmbed = new EmbedBuilder()
                        .setColor('#00ff00') // Verde para sucesso
                        .setTitle('📋 Scrapers Cadastrados')
                        .setDescription(
                            `Aqui está a lista de scrapers (${
                                i + 1
                            } a ${Math.min(i + chunkSize, scrapers.length)}):`,
                        )
                        .addFields(
                            chunk.map((scraper) => ({
                                name: ``,
                                value: `[**${scraper.title}**](${
                                    scraper.url
                                })\n*📅  Última verificação: ${new Date(
                                    scraper.lastCheckedDate,
                                ).toLocaleString('pt-BR', {
                                    FORMAT_DATETIME,
                                })}*\n`,
                                inline: false,
                            })),
                        )
                        .setThumbnail(
                            'https://preview.redd.it/the-best-form-of-glados-potato-glados-v0-ggxpi4yw29ma1.png?width=1080&crop=smart&auto=webp&s=6767adff011ffe9105e2e271176d98bd2860e570',
                        ) // Thumbnail geral do embed
                        .setFooter({
                            text: `Página ${
                                Math.floor(i / chunkSize) + 1
                            } de ${Math.ceil(scrapers.length / chunkSize)}`,
                            iconURL:
                                'https://preview.redd.it/the-best-form-of-glados-potato-glados-v0-ggxpi4yw29ma1.png?width=1080&crop=smart&auto=webp&s=6767adff011ffe9105e2e271176d98bd2860e570',
                        })
                        .setTimestamp()

                    // Envia o embed com o grupo atual de scrapers
                    await interaction.followUp({ embeds: [listEmbed] })
                }
            } else {
                // Se não houver scrapers cadastrados
                const noScrapersEmbed = new EmbedBuilder()
                    .setColor('#ffff00') // Amarelo para aviso
                    .setTitle('⚠️ Nenhum Scraper Cadastrado')
                    .setDescription('Não há scrapers cadastrados no momento.')
                    .setFooter({
                        text: 'Comando: list-scrapers',
                        iconURL:
                            'https://preview.redd.it/the-best-form-of-glados-potato-glados-v0-ggxpi4yw29ma1.png?width=1080&crop=smart&auto=webp&s=6767adff011ffe9105e2e271176d98bd2860e570',
                    })
                    .setTimestamp()

                await interaction.followUp({ embeds: [noScrapersEmbed] })
            }
        } catch (error) {
            console.error('Erro ao listar scrapers:', error)

            // Embed de erro
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000') // Vermelho para erro
                .setTitle('❌ Erro ao Listar Scrapers')
                .setDescription(
                    'Ocorreu um erro ao tentar listar os scrapers. Por favor, tente novamente mais tarde.',
                )
                .setFooter({
                    text: 'Comando: list-scrapers',
                    iconURL:
                        'https://preview.redd.it/the-best-form-of-glados-potato-glados-v0-ggxpi4yw29ma1.png?width=1080&crop=smart&auto=webp&s=6767adff011ffe9105e2e271176d98bd2860e570',
                })
                .setTimestamp()

            await interaction.followUp({ embeds: [errorEmbed] })
        }
    },
}
