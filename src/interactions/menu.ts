import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { StringSelectMenuInteraction } from 'discord.js';

export class MenuHandler extends InteractionHandler {
    public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.SelectMenu
        });
    }
    
    public override parse(interaction: StringSelectMenuInteraction) {
        if (interaction.customId !== 'product-select-menu') return this.none();

        return this.some();
    }

    public async run(interaction: StringSelectMenuInteraction) {
        const selectedProductId = interaction.values[0];

        const product = await this.container.prisma.product.findUnique({
            where: { id: parseInt(selectedProductId) }
        });

        if (!product) {
            return interaction.reply({
                content: 'El producto seleccionado no fue encontrado.',
                ephemeral: true
            });
        }
        return await interaction.reply({
            content: `Has seleccionado: **${product.name}**.\nDescripción: ${product.description}\nPrecio: $${product.price}`,
            ephemeral: true
        });
    }
}