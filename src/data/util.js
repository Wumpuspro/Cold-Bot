export async function getLogin() {
	const login = await import( '../private/login' );
	return login;
}

export async function getConfig() {
	const config = await import( './configDiscord' );
	return config;
}

export function sendMsg( client, msg ) {
	client.channel.send( msg );
}
