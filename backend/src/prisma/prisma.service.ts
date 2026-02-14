import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';

@Injectable()
export class PrismaService 
    extends PrismaClient 
    implements OnModuleInit, OnModuleDestroy 
{
    private pool: Pool;
    private static instance: PrismaService;
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

        const pool = new Pool({
            connectionString,

            max: 1,
            min: 0,

            idleTimeoutMillis:       10000,
            connectionTimeoutMillis: 5000,
            allowExitOnIdle:         false,
            ssl: process.env.NODE_ENV === 'production' 
                ? { rejectUnauthorized: false } 
                : false,
        });

        const adapter = new PrismaPg(pool);

        super({
            adapter,
            log: process.env.NODE_ENV === 'development' 
                ? ['error'] 
                : ['error'],
        });

        this.pool = pool;

        if(PrismaService.instance) return PrismaService.instance;
        PrismaService.instance = this;
    }

    async onModuleInit() {
        try {
            await this.$connect();
        } catch(error) {
            this.logger.error('Falha ao conectar o Prisma: ', error);
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
        await this.pool.end();
    }
}