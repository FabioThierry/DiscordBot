import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import packageJson from '../../../package.json' assert { type: 'json' }
import {
    BOT_INVITE_LINK,
    COLORS,
    EMBED_FOOTER_TEXT,
    FORMAT_DATE,
} from '../../config.js'
import dayjs from '../../dayjsSetup.js'

export default {
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription(
            'Shows information about the developer, version, links and more...',
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('user')
                .setDescription('Information about a user')
                .addUserOption((option) =>
                    option.setName('target').setDescription('User'),
                ),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('server')
                .setDescription('Information about the server'),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('bot')
                .setDescription('Information about the bot'),
        ),

    async execute(interaction) {
        // /info user [user]
        // /info server
        // /info bot

        await interaction.deferReply()

        const { client } = interaction

        const subcommand = interaction.options.getSubcommand()
        // console.log(subcommand)

        if (subcommand === 'bot') {
            const embed = new EmbedBuilder()
                .setTitle('Information')
                .setColor(COLORS.PRIMARY)
                .setThumbnail(client.user.displayAvatarURL())
                .setFooter({
                    // iconURL: client.user.displayAvatarURL(),
                    text: EMBED_FOOTER_TEXT,
                })
                .addFields([
                    {
                        name: 'Version',
                        value: `${packageJson.version}`,
                        inline: true,
                    },
                    {
                        name: 'Call me',
                        value: 'Misio',
                        inline: true,
                    },
                    {
                        name: 'Developer',
                        value: `${packageJson.author}\n• [stawowczyk.me](https://stawowczyk.me)`,
                        inline: false,
                    },
                    {
                        name: 'Links',
                        value:
                            // '• [Premium](https://dc.magictm.com/premium)\n' +
                            // '• [Help](https://dc.magictm.com/blog)\n' +
                            `• [Invite me to your server](${BOT_INVITE_LINK})`,
                        // '• [Feature request / Bug report](https://dc.magictm.com/feedback)',
                        inline: true,
                    },
                ])

            interaction.editReply({ embeds: [embed] })
        } else if (subcommand === 'server') {
            const server = interaction.guild
            const displayOwner = true

            if (!server.available) {
                return await this.guildNotAvailable(interaction)
            }

            const memberCount = server.members.cache.filter(
                (member) => !member.user.bot,
            ).size
            const botCount = server.members.cache.filter(
                (member) => member.user.bot,
            ).size

            // console.log(memberCount, botCount)

            const embed = new EmbedBuilder()
                .setTitle(`Information about the server ${server.name}`)
                .setColor(COLORS.PRIMARY)
                .setThumbnail(server.iconURL())
                .setFooter({
                    // iconURL: client.user.displayAvatarURL(),
                    text: EMBED_FOOTER_TEXT,
                })
                .addFields([
                    {
                        name: 'Server ID',
                        value: server.id,
                    },
                    {
                        name: 'Members',
                        value: memberCount.toString(),
                        inline: true,
                    },
                    {
                        name: 'Bots',
                        value: botCount.toString(),
                        inline: true,
                    },
                    // {
                    //     name: 'Members (bots)',
                    //     value: `${memberCount.toString()} (${botCount.toString()})`,
                    //     inline: true,
                    // },
                ])

            if (displayOwner) {
                const owner = await server.fetchOwner()
                embed.addFields({
                    name: 'Owner',
                    value: `${owner.user.displayName} (ID: ${owner.id})`,
                })
            }

            interaction.editReply({ embeds: [embed] })
        } else if (subcommand === 'user') {
            const user =
                interaction.options.getUser('target') || interaction.user

            const server = interaction.guild
            if (!server.available) {
                return await this.guildNotAvailable(interaction)
            }

            const member = server.members.cache.get(interaction.user.id)

            const embed = new EmbedBuilder()
                .setTitle(`Information about the user ${user.tag}`)
                .setColor(COLORS.PRIMARY)
                .setThumbnail(user.displayAvatarURL())
                .setFooter({
                    // iconURL: client.user.displayAvatarURL(),
                    text: EMBED_FOOTER_TEXT,
                })
                .addFields([
                    {
                        name: 'Username (ID)',
                        value: `${user.username} (${user.id})`,
                    },
                    {
                        name: 'Member since',
                        value: `${dayjs(member.joinedTimestamp).format(
                            FORMAT_DATE,
                        )}`,
                    },
                ])

            interaction.editReply({ embeds: [embed] })
        }
    },

    async guildNotAvailable(interaction) {
        return await interaction.editReply('The guild is not available.')
    },
}
