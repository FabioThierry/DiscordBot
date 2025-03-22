import { EmbedBuilder } from 'discord.js'
import { COLORS, FORMAT_DATE, FORMAT_DATETIME, BOT_AVATAR } from '../config.js'

// Embed para atualizações encontradas
export function createUpdateEmbed(update) {
    return new EmbedBuilder()
        .setColor(COLORS.GREEN) // Verde para sucesso
        .setTitle(`📚 Novo Capítulo Disponível: ${update.newData.title}`)
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
                value: `${
                    update.newData.lastChapter.date === 'New Chapter'
                        ? new Date(Date.now()).toLocaleString(
                              'pt-BR',
                              FORMAT_DATETIME,
                          )
                        : `${update.newData.lastChapter.date}`
                }`,
                inline: true,
            },
            {
                name: '🔗 Link do Capítulo',
                value: `[Clique aqui para ler](${
                    update.newData.lastChapter.url.startsWith('https://')
                        ? update.newData.lastChapter.url
                        : `https://${update.newData.lastChapter.url}`
                })`,
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
            ).toLocaleString('pt-BR', FORMAT_DATE)}`,
            iconURL: BOT_AVATAR,
        })
        .setTimestamp(new Date(Date.now()))
}

// Embed para nenhuma atualização encontrada
export function createNoUpdatesEmbed() {
    return new EmbedBuilder()
        .setColor(COLORS.WARNING)
        .setTitle('⚠️ Nenhuma Atualização Encontrada')
        .setDescription('Não foram encontradas novas atualizações no momento.')

        .setFooter({
            text: 'Comando: check-updates',
            iconURL: BOT_AVATAR,
        })
        .setTimestamp()
}

// Embed para erro ao verificar atualizações
export function createErrorEmbed() {
    return new EmbedBuilder()
        .setColor(COLORS.DANGER) // Vermelho para erro
        .setTitle('❌ Erro ao Verificar Atualizações')
        .setDescription(
            'Ocorreu um erro ao tentar verificar as atualizações. Por favor, tente novamente mais tarde.',
        )
        .setFooter({
            text: 'Comando: check-updates',
            iconURL: BOT_AVATAR,
        })
        .setThumbnail(BOT_AVATAR)
        .setTimestamp()
}

// Embed para "Scraper Adicionado com Sucesso"
export function createScraperSuccessEmbed(scrapedDataAdded, url) {
    return new EmbedBuilder()
        .setColor(COLORS.GREEN) // Verde para sucesso
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
        .setThumbnail('https://example.com/success-icon.png')
        .setFooter({
            text: 'Comando: scraper-add',
            iconURL: BOT_AVATAR,
        })
        .setTimestamp()
}
