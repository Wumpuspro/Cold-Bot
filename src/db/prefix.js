/* eslint-disable new-cap */
import { db } from './configDb';

import { getConfig } from '../data/util';

const dbPrefix = new db.table( 'prefix' );

export const getPrefix = async ( msg ) => {
	const config = await getConfig();

	if ( msg.channel.type === 'dm' ) return config.prefix;

	if ( !dbPrefix.has( `${ msg.guild.id }` ) ) {
		dbPrefix.set( `${ msg.guild.id }`, config.prefix );
	}
	const prefix = dbPrefix.get( `${ msg.guild.id }` );

	return prefix;
};

export const setPrefix = async ( msg, pref ) => {
	dbPrefix.set( `${ msg.guild.id }`, pref );
};
