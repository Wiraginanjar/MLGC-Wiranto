require('dotenv').config();
 
const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');
 
(async () => {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0',
        routes: {
            cors: {
              origin: ['*'],
            },
        },
    });
 
    const model = await loadModel();
    server.app.model = model;
 
    server.route(routes);
 
    server.ext('onPreResponse', function (request, h) {
        const response = request.response;
    
        // Check for custom InputError with specific message
        if (response instanceof InputError) {
            const message = response.message.includes("File size exceeds")
                ? `${response.message} Please upload a smaller file.`
                : `${response.message} Silakan gunakan foto lain.`;
    
            const newResponse = h.response({
                status: 'fail',
                message: message,
            });
            newResponse.code(response.output.statusCode || 400);
            return newResponse;
        }
    
        // Generic Boom error handling
        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: 'Payload content length greater than maximum allowed: 1000000',
            });
            newResponse.code(response.output.statusCode);
            return newResponse;
        }
    
        return h.continue;
    });
    
 
    await server.start();
    console.log(`Server start at: ${server.info.uri}`);
})();