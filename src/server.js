'use strict';

const Hapi = require('hapi');
import routes from './routes'


const server = Hapi.server({
    port: 8080,
    host: 'localhost'
});


const init = async () => {
    
    server.route(routes);

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();