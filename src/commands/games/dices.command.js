import { Colors, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { consola } from 'consola'
export default {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('dices')
        .setDescription('Roll a dice')
        .addNumberOption((option) =>
            option
                .setName('sides')
                .setDescription('Number of sides')
                .setRequired(true)
                .setMaxValue(100)
                .setMinValue(2),
        ),

    async execute(interaction) {
        const { user } = interaction

        const dice = interaction.options.getNumber('sides')

        const randomResult = Math.floor(Math.random() * dice) + 1
        consola.info(randomResult)
        const embed = new EmbedBuilder()
            .setTitle('Rolling Dices')
            .setColor(Colors.Green)
            .setImage('https://c.tenor.com/EuAwC485wRwAAAAC/tenor.gif')
            .setThumbnail(user.displayAvatarURL())
            .addFields([
                {
                    name: 'Dice',
                    value: randomResult.toString(),
                },
            ])
            .setDescription(
                `You rolled a ${randomResult} on a ${dice} sided dice.`,
            )

        interaction.reply({ embeds: [embed] })
    },
}
