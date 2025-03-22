import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { ScrapedReadsData } from '../../models/scraped-reads-data.model.js'

const scrapedReadsDataInstance = new ScrapedReadsData()

export default {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('delete-scraper')
        .setDescription('Deleta um scraper cadastrado.')
        .addStringOption((option) =>
            option
                .setName('titulo')
                .setDescription('O título do scraper que deseja deletar.')
                .setRequired(true),
        ),

    async execute(interaction) {
        const title = interaction.options.getString('titulo') // Obtém o título do scraper

        try {
            // Busca o scraper pelo título
            const scraper = await scrapedReadsDataInstance.getDataByTitle(title)

            if (scraper) {
                // Deleta o scraper
                const deleted = await scrapedReadsDataInstance.deleteData(
                    scraper._id,
                )

                if (deleted) {
                    // Embed de sucesso
                    const successEmbed = new EmbedBuilder()
                        .setColor('#00ff00') // Verde para sucesso
                        .setTitle('✅ Scraper Deletado com Sucesso')
                        .setDescription(
                            `O scraper **${scraper.title}** foi deletado com sucesso.`,
                        )
                        .setFooter({
                            text: 'Comando: delete-scraper',
                            iconURL: 'https://example.com/icon.png',
                        })
                        .setTimestamp()

                    await interaction.reply({ embeds: [successEmbed] })
                } else {
                    // Embed de falha
                    const failEmbed = new EmbedBuilder()
                        .setColor('#ff0000') // Vermelho para falha
                        .setTitle('❌ Falha ao Deletar Scraper')
                        .setDescription(
                            `O scraper **${scraper.title}** não pôde ser deletado.`,
                        )
                        .setFooter({
                            text: 'Comando: delete-scraper',
                            iconURL: 'https://example.com/icon.png',
                        })
                        .setTimestamp()

                    await interaction.reply({ embeds: [failEmbed] })
                }
            } else {
                // Embed de scraper não encontrado
                const notFoundEmbed = new EmbedBuilder()
                    .setColor('#ffff00') // Amarelo para aviso
                    .setTitle('⚠️ Scraper Não Encontrado')
                    .setDescription(
                        `Nenhum scraper com o título **${title}** foi encontrado.`,
                    )
                    .setFooter({
                        text: 'Comando: delete-scraper',
                        iconURL: 'https://example.com/icon.png',
                    })
                    .setTimestamp()

                await interaction.reply({ embeds: [notFoundEmbed] })
            }
        } catch (error) {
            console.error('Erro ao deletar scraper:', error)

            // Embed de erro
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000') // Vermelho para erro
                .setTitle('❌ Erro ao Deletar Scraper')
                .setDescription(
                    'Ocorreu um erro ao tentar deletar o scraper. Por favor, tente novamente mais tarde.',
                )
                .setFooter({
                    text: 'Comando: delete-scraper',
                    iconURL: 'https://example.com/icon.png',
                })
                .setTimestamp()

            await interaction.reply({ embeds: [errorEmbed] })
        }
    },
}
