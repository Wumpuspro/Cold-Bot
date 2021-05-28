import { MessageEmbed } from 'discord.js';

import { getMsgTicket, setMsgTicket } from '../../../db/ticket';

import { color } from '../../util';
import language from '../../functions/language';

let lang;

const descriptionTicket = async ( channel, user ) => {
	const embed = new MessageEmbed();

	embed.setColor( color() );
	embed.setTimestamp();
	embed.setTitle( lang.ticket.titleTicket );
	embed.setDescription( lang.ticket.descripTicket.replace( '{{ id }}', user.id ) );

	channel.send( embed ).then( ( msg ) => {
		msg.react( '❌' );
	} );
};

const createCategory = async ( msg, name ) => {
	const channel = await msg.guild.channels.create( name, {
		reason: 'Ticket Category',
		type: 'category'
	} );

	return channel;
};

export const createTicket = async ( msg, user ) => {
	let nameUser = user.username.trim().toLowerCase().replace( /\s+/g, '' );
	nameUser += `⚪${user.discriminator}`;

	const canal = await msg.guild.channels.cache.find(
		( c ) => c.name === `ticket-${ nameUser }`
	);
	if ( canal ) return;

	let categoryTicket = await msg.guild.channels.cache.find( ( ch ) => ch.name === '📨 Tickets' );
	if ( !categoryTicket ) categoryTicket = await createCategory( msg, '📨 Tickets' );

	msg.guild.channels.create( `ticket-${ nameUser }`,
		{
			reason: 'Ticket',
			permissionOverwrites: [
				{
					id: user.id,
					allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
				},
				{
					id: msg.guild.roles.everyone,
					deny: ['VIEW_CHANNEL']
				}
			],
			type: 'text',
			parent: categoryTicket
		} ).then( ( channel ) => {
		descriptionTicket( channel, user );
	} );
};

const description = async ( msg ) => {
	const msgId = await getMsgTicket( msg );
	await msg.channel.messages.fetch( msgId ).then( ( msgTicket ) => {
		msgTicket.delete();
	} ).catch( () => {} );

	const embed = new MessageEmbed();

	embed.setColor( color() );
	embed.setTimestamp();
	embed.setTitle( lang.ticket.titleSupport );
	embed.setDescription( lang.ticket.descripEnable );

	return embed;
};

const deleteDescription = async ( msg ) => {
	const msgId = await getMsgTicket( msg );
	await msg.channel.messages.fetch( msgId ).then( ( msgTicket ) => {
		msgTicket.delete();
	} ).catch( () => {} );

	const embed = new MessageEmbed();

	embed.setColor( color() );
	embed.setTimestamp();
	embed.setTitle( lang.ticket.titleSupport );
	embed.setDescription( lang.ticket.descripDisabled );

	msg.channel.send( embed ).then( async ( msgEmbed ) => {
		await setMsgTicket( msg, msgEmbed.id );
	} );

	msg.delete();
};

export default {
	name: 'ticket',
	alias: ['ticket-setup'],
	category: 'admin',
	usage: ( langs, p, s ) => langs.ticket.usage.replace( /{{ p }}/g, p ).replace( /{{ s }}/g, s ),
	description: ( langs ) => langs.ticket.description,
	req: {
		minArgs: 0,
		cooldown: 0,
		dm: false,
		enable: true,
		visible: true,
		permissions: ['ADMINISTRATOR'],
		necessary: []
	},
	run: async ( client, msg, args ) => {
		lang = language( client, msg.guild );

		if ( args[0] === 'close' ) return deleteDescription( msg );

		const embed = await description( msg );

		msg.channel.send( embed ).then( async ( msgEmbed ) => {
			await setMsgTicket( msg, msgEmbed.id );
			msgEmbed.react( '📩' );
		} );

		msg.delete();
	},
};