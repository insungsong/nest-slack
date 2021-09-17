import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { ChannelChats } from './src/entities/ChannelChats.entity';
import { ChannelMembers } from './src/entities/ChannelMembers.entity';
import { Channels } from './src/entities/Channels.entity';
import { DMs } from './src/entities/DMs.entity';
import { Mentions } from './src/entities/Mentions.entity';
import { Users } from './src/entities/Users.entity';
import { WorkspaceMembers } from './src/entities/WorkspaceMembers.entity';
import { Workspaces } from './src/entities/Workspaces.entity';

dotenv.config();
const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    ChannelChats,
    ChannelMembers,
    Channels,
    DMs,
    Mentions,
    Users,
    WorkspaceMembers,
    Workspaces,
  ],
  migrations: [__dirname + '/src/migrations/*.ts'],
  cli: { migrationsDir: 'src/migrations' },
  autoLoadEntities: true,
  synchronize: false,
  logging: true,
  keepConnectionAlive: true,
};

export = config;
