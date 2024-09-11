import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ActionRowBuilder, ApplicationCommandType, StringSelectMenuBuilder, type Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'ping pong'
})
export class UserCommand extends Command {
	// Register slash and context menu command
	public override registerApplicationCommands(registry: Command.Registry) {
		// Register slash command
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});

		// Register context menu command available from any message
		registry.registerContextMenuCommand({
			name: this.name,
			type: ApplicationCommandType.Message
		});

		// Register context menu command available from any user
		registry.registerContextMenuCommand({
			name: this.name,
			type: ApplicationCommandType.User
		});
	}

	// Message command
	public override async messageRun(message: Message) {
		const products = await this.container.prisma.product.findMany({
			include: {
				category: true
			}
		});

		if (products.length === 0) {
			return message.reply({ content: 'No hay productos disponibles.' });
		}

		const options = products.map((product) => ({
			label: product.name,
			description: `${product.category.name} - ${product.description}`,
			value: product.id.toString(),
			emoji: product.emoji || undefined
		}));

		return message.reply({
			content: 'Por favor selecciona un producto:',
			components: [
				new ActionRowBuilder<StringSelectMenuBuilder>()
					.addComponents(
						new StringSelectMenuBuilder()
							.setCustomId('product-select-menu')
							.setPlaceholder('Selecciona un producto')
							.addOptions(options))]
		});
	}

	// slash command
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const msg = await interaction.reply({ content: 'Ping?', fetchReply: true });

		const content = `Pong! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${msg.createdTimestamp - interaction.createdTimestamp
			}ms.`;

		return interaction.editReply({ content });
	}

	// context menu command
	public override async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
		const msg = await interaction.reply({ content: 'Ping?', fetchReply: true });

		const content = `Pong! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${msg.createdTimestamp - interaction.createdTimestamp
			}ms.`;

		return interaction.editReply({ content });
	}
}
