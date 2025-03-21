import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { ScrapedReadsData } from '../../models/Scraped-reads-data.model.js'
import { FORMAT_DATETIME } from '../../config.js'

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
                // Cria um embed para listar os scrapers
                const listEmbed = new EmbedBuilder()
                    .setColor('#00ff00') // Verde para sucesso
                    .setTitle('📋 Scrapers Cadastrados')
                    .setDescription(
                        'Aqui está a lista de todos os scrapers cadastrados:',
                    )
                    .setFooter({
                        text: 'Comando: list-scrapers',
                        iconURL: 'https://example.com/icon.png',
                    })
                    .setTimestamp()
                // Limit to 25 items (Discord's maximum fields per embed)
                const maxItems = Math.min(scrapers.length, 25)

                // Update description to indicate if there are more items
                if (scrapers.length > 25) {
                    listEmbed.setDescription(
                        `Mostrando 25 de ${scrapers.length} scrapers cadastrados (limite do Discord).`,
                    )
                } else {
                    listEmbed.setDescription(
                        `Aqui está a lista de todos os ${scrapers.length} scrapers cadastrados:`,
                    )
                }

                // Add only up to 25 fields
                const fieldsToAdd = []
                for (let i = 0; i < maxItems; i++) {
                    const scraper = scrapers[i]
                    const truncatedTitle =
                        scraper.title.length > 25
                            ? `${scraper.title.substring(0, 22)}...`
                            : scraper.title

                    fieldsToAdd.push({
                        name: truncatedTitle,
                        value: `📅 Última verificação: ${new Date(
                            scraper.lastCheckedDate,
                        ).toLocaleString('pt-BR', FORMAT_DATETIME)}`,
                        inline: false,
                    })
                }

                listEmbed.addFields(fieldsToAdd)

                // Envia o embed com a lista de scrapers
                await interaction.followUp({ embeds: [listEmbed] })
            } else {
                // Se não houver scrapers cadastrados
                const noScrapersEmbed = new EmbedBuilder()
                    .setColor('#ffff00') // Amarelo para aviso
                    .setTitle('⚠️ Nenhum Scraper Cadastrado')
                    .setDescription('Não há scrapers cadastrados no momento.')
                    .setFooter({
                        text: 'Comando: list-scrapers',
                        iconURL: 'https://example.com/icon.png',
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
                    iconURL: 'https://example.com/icon.png',
                })
                .setTimestamp()

            await interaction.followUp({ embeds: [errorEmbed] })
        }
    },
}
