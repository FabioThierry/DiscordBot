import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'

export default {
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a member from the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user to kick')
                .setRequired(true),
        )
        .addStringOption((option) =>
            option.setName('reason').setDescription('Kick reason'),
        )
        .setDMPermission(false),

    async execute(interaction) {
        // const commandUser = interaction.user
        const targetUser = interaction.options.getUser('user')
        const reason =
            interaction.options.getString('reason') || 'No reason provided.'

        await interaction.deferReply({ ephemeral: true })

        const commandMember = interaction.member
        const botMember = interaction.guild.members.me
        // const targetMember = interaction.guild.members.cache.get(targetUser.id)
        const targetMember = await interaction.guild.members
            .fetch(targetUser.id)
            .catch(() => null)

        if (targetMember == null) {
            return interaction.editReply('User is not a member of this guild!')
        }

        // Check if user is trying to kick themselves
        if (targetUser.id == commandMember.user.id) {
            return interaction.editReply('You cannot kick yourself.')
        }

        // Check if user is trying to kick the bot
        if (targetUser.id == interaction.client.user.id) {
            return interaction.editReply('I cannot kick myself.')
        }

        // Check user permissions
        if (!commandMember.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.editReply(
                'You do not have permissions to kick users.',
            )
        }

        // Check bot permissions
        if (!botMember.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.editReply(
                'I do not have permissions to kick users.',
            )
        }

        const targetHighestRolePosition = targetMember.roles.highest.position
        const commandHighestRolePosition = commandMember.roles.highest.position
        const botHighestRolePosition =
            interaction.guild.members.me.roles.highest.position

        // console.log(
        //     commandHighestRolePosition,
        //     targetHighestRolePosition,
        //     botHighestRolePosition,
        // )

        // Check if user has higher or equal role than bot
        if (targetHighestRolePosition >= botHighestRolePosition) {
            return interaction.editReply(
                'I cannot kick a user with higher or equal role.',
            )
        }

        // Server owner can always kick a user
        if (interaction.user.id === interaction.guild.ownerId) {
            // console.log('Command used by server owner!')
            return this.kick(interaction, targetMember, reason)
        }

        // Check if user to kick has higher or equal role than command user
        if (targetHighestRolePosition >= commandHighestRolePosition) {
            return interaction.editReply(
                'You cannot kick a user with higher or equal role.',
            )
        }

        // Check if user can be kicked
        if (!targetMember.kickable) {
            return interaction.editReply('I cannot kick this user.')
        }

        // Kick user
        await this.kick(interaction, targetMember, reason)
    },

    async kick(interaction, targetMember, reason) {
        try {
            await targetMember.kick({ reason })

            await interaction.editReply(
                `Kicked user ${targetMember.user.tag} for reason: "${reason}"`,
            )
        } catch (error) {
            interaction.editReply(
                'Failed to kick user! An error occurred while executing this command. Please contact the bot developer.',
            )
        }
    },
}
