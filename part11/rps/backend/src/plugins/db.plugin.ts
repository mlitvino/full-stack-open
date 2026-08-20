/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { FastifyInstance } from 'fastify';
import dbConnection from 'typeorm-fastify-plugin';
import { DataSource } from 'typeorm';
import { config } from '../config.js';
import { Match } from '../repositories/matches.entity.js';

const connection = new DataSource({
  type: 'postgres',
  port: 5432,
  host: config.db.host,
  username: config.db.user,
  password: config.db.password,
  database: config.db.db,
  synchronize: true,
  entities: [Match],
});

const typeormPlugin = dbConnection as any;

export function registerDb(fastify: FastifyInstance) {
  fastify.register(typeormPlugin, { connection });
}

