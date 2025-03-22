import { scrapeUrl } from '../../services/scraper.service.js'
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { ScrapedReadsData } from '../../models/scraped-reads-data.model.js'
import { COLORS } from '../../config.js'

const scrapedReadsDataInstance = new ScrapedReadsData()

export default {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('scraper-add')
        .setDescription('Add a new scraper.')
        .addStringOption((option) =>
            option
                .setName('url')
                .setDescription('Scraper URL')
                .setRequired(true),
        ),

    async execute(interaction) {
        const url = interaction.options.getString('url')

        // Scrape the URL
        const scrapedData = await scrapeUrl(url)

        // If no scraper is available for the site
        if (scrapedData === 'No scraper available for this site') {
            const noScraperEmbed = new EmbedBuilder()
                .setColor(COLORS.WARNING) // Vermelho para erro
                .setTitle('❌ Scraper Não Disponível')
                .setDescription(
                    'Não há um scraper disponível para este site. Por favor, use o comando `scrape-add-selector` para adicionar manualmente.',
                )
                .setFooter({
                    text: 'Comando: scraper-add',
                    iconURL: 'https://cdn-icons-png.flaticon.com/512/0/655.png',
                })
                .setTimestamp()

            return await interaction.reply({ embeds: [noScraperEmbed] })
        }

        try {
            // Add the scraped data to the database
            const scrapedDataAdded = await scrapedReadsDataInstance.createData(
                scrapedData,
            )

            if (scrapedDataAdded) {
                const successEmbed = new EmbedBuilder()
                    .setColor(COLORS.SUCCESS) // Verde para sucesso
                    .setTitle('✅ Scraper Adicionado com Sucesso')
                    .setDescription(
                        `O scraper **${scrapedDataAdded.title}** foi adicionado com sucesso!`,
                    )
                    .addFields(
                        {
                            name: '📌 URL',
                            value: `[Clique aqui para visitar](${url})`,
                            inline: false,
                        },
                        {
                            name: '📅 Data de Adição',
                            value: new Date().toLocaleString(),
                            inline: true,
                        },
                    )
                    .setThumbnail(
                        'https://cdn-icons-png.flaticon.com/512/4403/4403384.png',
                    )
                    .setFooter({
                        text: 'Comando: scraper-add',
                        iconURL:
                            'https://cdn-icons-png.flaticon.com/512/0/655.png',
                    })
                    .setTimestamp()

                await interaction.reply({ embeds: [successEmbed] })
            } else {
                const failEmbed = new EmbedBuilder()
                    .setColor(COLORS.DANGER) // Vermelho para falha
                    .setTitle('❌ Falha ao Adicionar Scraper')
                    .setDescription(
                        `O scraper **${scrapedData.title}** falhou ao ser adicionado.`,
                    )
                    .setFooter({
                        text: 'Comando: scraper-add',
                        iconURL:
                            'https://cdn-icons-png.flaticon.com/512/0/655.png',
                    })
                    .setTimestamp()

                await interaction.reply({ embeds: [failEmbed] })
            }
        } catch (error) {
            console.error('Erro ao adicionar scraper:', error)

            const errorEmbed = new EmbedBuilder()
                .setColor(COLORS.DANGER) // Vermelho para erro
                .setTitle('❌ Erro ao Adicionar Scraper')
                .setDescription(
                    'Ocorreu um erro ao tentar adicionar o scraper. Por favor, tente novamente mais tarde.',
                )
                .setFooter({
                    text: 'Comando: scraper-add',
                    iconURL: 'https://cdn-icons-png.flaticon.com/512/0/655.png',
                })
                .setTimestamp()

            await interaction.reply({ embeds: [errorEmbed] })
        }
    },
}

// import { scrapeUrl } from '../../services/scraper.service.js'
// import { SlashCommandBuilder } from 'discord.js'
// import { ScrapedReadsData } from '../../models/Scraped-reads-data.model.js'

// const scrapedReadsDataInstance = new ScrapedReadsData()

// export default {
//     cooldown: 5,
//     data: new SlashCommandBuilder()
//         .setName('scraper-add')
//         .setDescription('Add a new scraper.')
//         .addStringOption((option) =>
//             option
//                 .setName('url')
//                 .setDescription('Scraper URL')
//                 .setRequired(true),
//         ),

//     async execute(interaction) {
//         const url = interaction.options.getString('url')

//         const channelId = interaction.channel.id

//         const scrapedData = await scrapeUrl(url)

//         if (scrapedData === 'No scraper available for this site') {
//             return await interaction.reply(
//                 'Scraper NOT available for this site, please use another command "scrape-add-selector"!',
//             )
//         }
//         try {
//             const scrapedDataAdded = await scrapedReadsDataInstance.createData(
//                 scrapedData,
//                 channelId,
//             )
//             if (scrapedDataAdded) {
//                 await interaction.reply(
//                     `Scraper ${scrapedDataAdded.title} added SUCCESSFULLY`,
//                 )
//             } else {
//                 await interaction.reply(
//                     `Scraper ${scrapedData.title} FAILED to be added`,
//                 )
//             }
//         } catch (error) {
//             console.error('Error adding scraper ' + error)
//             await interaction.reply('Scraper failed to be added')
//         }
//     },
// }
