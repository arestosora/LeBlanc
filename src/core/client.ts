import { PrismaClient } from "@prisma/client";
import { container, LogLevel, SapphireClient } from "@sapphire/framework";
import { getRootData } from "@sapphire/pieces";
import { GatewayIntentBits, Partials } from "discord.js";
import { join } from "path";

export class Client extends SapphireClient {
    private rootData = getRootData();
    constructor() {
        super({
            defaultPrefix: '!',
            regexPrefix: /^(hey +)?bot[,! ]/i,
            caseInsensitiveCommands: true,
            logger: {
                level: LogLevel.Debug
            },
            shards: 'auto',
            intents: [
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.MessageContent
            ],
            partials: [Partials.Channel],
            loadMessageCommandListeners: true
        })

        this.stores.get('interaction-handlers').registerPath(join(this.rootData.root, 'interactions'));
    }

    public override async login(token?: string): Promise<string> {
        container.prisma = new PrismaClient();
        return super.login(token)
    }
}