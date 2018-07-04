'use strict';

const Hapi = require('hapi');
import routes from './routes'

// validation function
const validate = async function (user,decoded, request) {
    // checks to see if the person is valid
    if (!user['_id']) {
      return { isValid: false };
    }
    else {
      return { isValid: true };
    }
};


const init = async () => {
    const server = new Hapi.Server({ port: 8080 });

    await server.register(require('hapi-auth-jwt2'));

    server.auth.strategy('jwt', 'jwt',
      { key: 'vZiIpmTzqXHp8PpYXTwqc9SRQ1UAyAfC',
        validate:validate,
        verifyOptions: { algorithms: [ 'HS256' ] }
      });

    // server.auth.default('jwt');

    server.route( routes );

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();