import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import consola from 'consola'

export default {
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a user from the server.')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('User to unban')
                .setRequired(true),
        )
        .addStringOption((option) =>
            option.setName('reason').setDescription('Unban reason'),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),

    async execute(interaction) {
        // /unban <user> [reason]
        const targetUser = interaction.options.getUser('user')
        const reason =
            interaction.options.getString('reason') || 'No reason provided'

        await interaction.deferReply({ ephemeral: true })

        const commandMember = interaction.member
        const botMember = interaction.guild.members.me

        // Check if user tries to unban themselves
        if (targetUser.id == commandMember.user.id) {
            return interaction.editReply('You cannot unban yourself.')
        }

        // Check if user tries to unban the bot
        if (targetUser.id == interaction.client.user.id) {
            return interaction.editReply('I cannot unban myself.')
        }

        // Check user permissions
        if (!commandMember.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.editReply(
                'You do not have permissions to ban users.',
            )
        }

        // Check bot permissions
        if (!botMember.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.editReply(
                'I do not have permissions to ban users.',
            )
        }

        const guildBans = await interaction.guild.bans.fetch()
        if (!guildBans.size) {
            return interaction.editReply(
                'This server does not have any banned users.',
            )
        }

        if (guildBans.has(targetUser.id)) {
            // Unban the user
            return this.unbanUser(interaction, targetUser, reason)
        }

        interaction.editReply('This user is not banned!')
    },

    async unbanUser(interaction, targetUser, reason) {
        try {
            await interaction.guild.bans.remove(targetUser.id)

            await interaction.editReply(
                `Unbanned user ${targetUser.tag} for reason: "${reason}"`,
            )
        } catch (error) {
            consola.error(error)
            interaction.editReply(
                'Failed to unban user! An error occurred while executing this command. Please contact the bot developer.',
            )
        }
    },
}
