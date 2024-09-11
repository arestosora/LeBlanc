import { PrismaClient } from "@prisma/client";
import { container, LogLevel, SapphireClient } from "@sapphire/framework";
import { GatewayIntentBits, Partials } from "discord.js";

export class Client extends SapphireClient {
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
    }

    public override async login(token?: string): Promise<string> {
        container.prisma = new PrismaClient();
        return super.login(token)
    }
}

const client = new Client();
export default client;