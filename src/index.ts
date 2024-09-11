import { Client } from './core/client';
import './lib/setup';

const main = async () => {
	const client = new Client();
	try {
		client.logger.info('Logging in');
		await client.login();
		client.logger.info('logged in');
	} catch (error) {
		client.logger.fatal(error);
		await client.destroy();
		process.exit(1);
	}
};

void main();
