import { MessageEmbed } from 'discord.js';

import { sendMsg } from '../util';

const commandMessage = async ( client, msg ) => {
	const embed = new MessageEmbed();

	embed.setColor( '#E58249' );
	embed.setTitle( 'Lista de Comandos' );
	embed.setAuthor( msg.author.username, msg.author.avatarURL() );
	embed.setTimestamp( Date.now() );

	client.commands.map( ( c ) => embed.addField(
		`${ client.prefix } ${ c.name }`,
		`>>> \`Alias:\`${ c.alias.map( ( a ) => ` ${ a }` ) } \`Argumentos:\` ${ c.description } \t`
	) );

	return embed;
};

const helpMessage = async ( client ) => {
	const embed = new MessageEmbed();

	embed.setColor( '#E58249' );
	if ( !client.splitStrings.status ) return embed.setDescription( `Hola, El prefix es \`${ client.prefix }\`` );

	embed.setDescription(
		`Hola, El prefix es \`${ client.prefix }\`, y el separador de argumentos es \`${ client.splitStrings.value }\``
	);

	return embed;
};

export default {
	name: 'help',
	alias: ['h'],
	description: 'No requiere parametros',
	req: {
		args: 0,
		enable: true,
		visible: false,
		permissions: [],
	},
	run: async ( client, msg, _args ) => {
		let embed;

		embed = await helpMessage( client );
		sendMsg( msg, embed );

		embed = await commandMessage( client, msg );
		sendMsg( msg, embed );

		msg.delete();
	},
};
