import type { FastifyInstance } from 'fastify';
import { DatabaseService } from '../services/database';

const dbService = new DatabaseService();

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async () => {
    return {
      success: true,
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  });

  fastify.get('/api/stats', async () => {
    try {
      const totalSearches = await dbService.getStat('total_searches');

      return {
        success: true,
        data: {
          totalSearches: totalSearches.toString(),
          server: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            version: '1.0.0',
          },
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch stats',
        timestamp: new Date().toISOString(),
      };
    }
  });
}
