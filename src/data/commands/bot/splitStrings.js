import { sendEmbed } from '../../util';
import { getSplit, setSplit } from '../../../db/splitString';
import language from '../../functions/language';

export default {
	name: 'setsplit',
	alias: ['split', 'string'],
	category: 'bot',
	usage: ( langs, p, s ) => langs.split.usage.replace( /{{ p }}/g, p ).replace( /{{ s }}/g, s ),
	description: ( langs ) => langs.split.description,
	req: {
		minArgs: 2,
		dm: false,
		cooldown: 10,
		enable: true,
		visible: true,
		permissions: ['ADMINISTRATOR'],
		necessary: []
	},
	run: async ( client, msg, args ) => {
		const lang = language( client, msg.guild );

		let estado = false;
		args[0] = args[0].toLowerCase();

		const split = await getSplit( msg );

		if ( args[1] === '' ) {
			args[1] = split.value;
		}

		if ( args[0] === 'true' ) {
			estado = true;
			setSplit( msg, true, args[1] );
		} else {
			setSplit( msg, false, args[1] );
		}

		sendEmbed( { place: msg.channel, text: lang.split.message.replace( '{{ split }}', args[1] ) } );
		if ( estado ) {
			sendEmbed( { place: msg.channel, text: lang.split.activated } );
		} else {
			sendEmbed( { place: msg.channel, text: lang.split.disabled } );
		}
	},
};
