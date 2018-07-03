'use strict';

const Hapi = require('hapi');
import routes from './routes'

// validation function
const validate = async function (decoded, request) {

    // do your checks to see if the person is valid
    if (!people[decoded.id]) {
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
        validate,
        verifyOptions: { ignoreExpiration: true }
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