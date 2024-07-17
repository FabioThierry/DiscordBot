import scrapeWebnovel from '../../services/webscraping/scraperService.js'
import { SlashCommandBuilder } from 'discord.js'
import ScrapedReadsData from '../../models/ScrapedReadsDataModel.js'

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
        const channelId = interaction.channel.id
        console.log('channelId', channelId)
        const scrapedData = await scrapeWebnovel(url)
        if (scrapedData === 'No scraper available for this site') {
            return await interaction.reply(
                'Scraper NOT available for this site, please use another command "scrape-add-selector"!',
            )
        }
        try {
            const scrapedDataAdded = await scrapedReadsDataInstance.createData(
                scrapedData,
                channelId,
            )
            if (scrapedDataAdded) {
                await interaction.reply(
                    `Scraper ${scrapedDataAdded.title} added SUCCESSFULLY`,
                )
            } else {
                await interaction.reply(
                    `Scraper ${scrapedData.title} FAILED to be added`,
                )
            }
        } catch (error) {
            console.error('Error adding scraper ' + error)
            await interaction.reply('Scraper failed to be added')
        }
    },
}
