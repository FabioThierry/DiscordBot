import scrapeWebnovel from '../../services/webscraping/scraperService.js'
import { SlashCommandBuilder } from 'discord.js'

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
        const scrapedData = await scrapeWebnovel(url)
        if (scrapedData === 'No scraper available for this site') {
            return await interaction.reply(
                'Scraper NOT available for this site, please use another command "scrape-add-selector"!',
            )
        }

        await interaction.reply(
            `Scraper ${scrapedData.title} added to the list.`,
        )
    },
}
