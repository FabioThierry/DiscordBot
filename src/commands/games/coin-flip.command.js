import { Colors, EmbedBuilder, SlashCommandBuilder } from 'discord.js'

export default {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a coin. Head or Tails? You have 50% chances.')
        .addStringOption((option) =>
            option
                .setName('bet')
                .setDescription('Bet on the result: Head or Tails')
                .setRequired(false)
                .addChoices(
                    {
                        name: 'Head',
                        value: 'head',
                    },
                    {
                        name: 'Tails',
                        value: 'tails',
                    },
                ),
        ),

    async execute(interaction) {
        const { user } = interaction

        const bet = interaction.options.getString('bet')

        // Generate a random number that will represent the coin (0) or tails (1)
        const randomResult = Math.random() < 0.5 ? 'head' : 'tails'

        const embed = new EmbedBuilder()
            .setTitle('Coin Flip (Head or Tails)')
            .setColor(Colors.Gold)
            .setThumbnail(user.displayAvatarURL())

            .addFields([
                {
                    name: 'Result',
                    value: randomResult === 'head' ? 'Head' : 'Tails',
                },
            ])
            .setDescription('Will it be Head or Tails? :coin:')

        if (bet) {
            embed.addFields({
                name: 'Bet',
                value: bet === 'head' ? 'Head' : 'Tails',
            })

            if (bet === randomResult) {
                embed.addFields({
                    name: 'Bet Result',
                    value: 'Correctly placed! 🎉',
                })
            } else {
                embed.addFields({
                    name: 'Bet Result',
                    value: 'Unfortunately incorrectly placed. 😔',
                })
            }
        }

        interaction.reply({ embeds: [embed] })
    },
}
