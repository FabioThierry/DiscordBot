import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { COMMAND_BAN_BAN_ONLY_MEMBERS } from '../../config.js'
import consola from 'consola'

export default {
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a member from the server.')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user to ban')
                .setRequired(true),
        )
        .addStringOption((option) =>
            option.setName('reason').setDescription('Ban reason'),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),

    async execute(interaction) {
        // /ban <user> [reason]
        const targetUser = interaction.options.getUser('user')
        const reason =
            interaction.options.getString('reason') || 'No reason provided'

        await interaction.deferReply({ ephemeral: true })

        const commandMember = interaction.member
        const botMember = interaction.guild.members.me
        const targetMember = await interaction.guild.members
            .fetch(targetUser.id)
            .catch(() => null)

        if (COMMAND_BAN_BAN_ONLY_MEMBERS && targetMember == null) {
            return interaction.editReply('User is not a member of this guild!')
        }

        // Check if the user tries to ban himself/herself
        if (targetUser.id == commandMember.user.id) {
            return interaction.editReply('You cannot ban yourself.')
        }

        // Check if the user tries to ban the bot
        if (targetUser.id == interaction.client.user.id) {
            return interaction.editReply('I cannot ban myself.')
        }

        // Check permissions of the user
        if (!commandMember.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.editReply(
                'You do not have permissions to ban users.',
            )
        }

        // Check permissions of the bot
        if (!botMember.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.editReply(
                'I do not have permissions to ban users.',
            )
        }

        const targetHighestRolePosition =
            targetMember?.roles?.highest?.position ?? -1
        const commandHighestRolePosition = commandMember.roles.highest.position
        const botHighestRolePosition = botMember.roles.highest.position

        // Check if the user has a higher or equal role than the bot
        if (targetHighestRolePosition >= botHighestRolePosition) {
            return interaction.editReply(
                'I cannot ban a user with a higher or equal role.',
            )
        }

        // The server owner can always kick a user
        if (interaction.user.id === interaction.guild.ownerId) {
            if (COMMAND_BAN_BAN_ONLY_MEMBERS) {
                return this.banMember(interaction, targetMember, reason)
            } else {
                return this.banUser(interaction, targetUser, reason)
            }
        }

        // Check if the user do ban has a higher or equal role than the bot
        if (targetHighestRolePosition >= commandHighestRolePosition) {
            return interaction.editReply(
                'You cannot ban a user with a higher or equal role.',
            )
        }

        // Check if the user can be banned
        if (!targetMember?.bannable) {
            return interaction.editReply('I cannot ban that user!')
        }

        // Ban the user
        if (COMMAND_BAN_BAN_ONLY_MEMBERS) {
            await this.banMember(interaction, targetMember, reason)
        } else {
            await this.banUser(interaction, targetUser, reason)
        }
    },

    async banUser(interaction, targetUser, reason) {
        try {
            await interaction.guild.members.ban(targetUser, { reason })

            await interaction.editReply(
                `Banned user ${targetUser.tag} for reason: "${reason}"`,
            )
        } catch (error) {
            consola.error(error)
            interaction.editReply(
                'Failed to ban user! An error occurred while executing this command. Please contact the bot developer.',
            )
        }
    },
    async banMember(interaction, targetMember, reason) {
        try {
            await targetMember.ban({ reason })

            await interaction.editReply(
                `Banned user ${targetMember.user.tag} for reason: "${reason}"`,
            )
        } catch (error) {
            consola.error(error)
            interaction.editReply(
                'Failed to ban guild member! An error occurred while executing this command. Please contact the bot developer.',
            )
        }
    },
}
