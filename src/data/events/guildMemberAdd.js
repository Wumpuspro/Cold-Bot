import { sendWelcome } from '../web/welcomehook';

export default async ( _client, member ) => {
	const message = `Bienvenido ${ member } al Servidor Git Merge!!`;
	sendWelcome( message );
};
