import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pino } from 'pino';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, '..', '..', 'logs', `roll-${(new Date)
  .toISOString()
  .substring(0, 10)}.log`);
const logger = pino({ transport: { targets: [{
  level: 'info',
  target: 'pino-pretty',
  options: {
    colorize: true,
    ignore: 'pid,hostname',
    translateTime: 'yyyy-mm-dd HH:MM:ss',
  },
}, {
  level: 'info',
  target: 'pino/file',
  options: { destination: filePath },
}] } });

export default logger;
