import Fastify from 'fastify';
import { config } from './config.js';
import app from './app.js';

const fastify = Fastify({
  logger: config.logger.development,
  routerOptions: {
    ignoreTrailingSlash: true,
  },
});

fastify.register(app, { prefix: '/api' });

fastify.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
