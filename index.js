/**

  ██████╗░███████╗███╗░░░███╗░█████╗░░░░░░░██████╗░███████╗░██████╗████████╗░░░░░░░█████╗░██████╗░██╗
  ██╔══██╗██╔════╝████╗░████║██╔══██╗░░░░░░██╔══██╗██╔════╝██╔════╝╚══██╔══╝░░░░░░██╔══██╗██╔══██╗██║
  ██║░░██║█████╗░░██╔████╔██║██║░░██║█████╗██████╔╝█████╗░░╚█████╗░░░░██║░░░█████╗███████║██████╔╝██║
  ██║░░██║██╔══╝░░██║╚██╔╝██║██║░░██║╚════╝██╔══██╗██╔══╝░░░╚═══██╗░░░██║░░░╚════╝██╔══██║██╔═══╝░██║
  ██████╔╝███████╗██║░╚═╝░██║╚█████╔╝░░░░░░██║░░██║███████╗██████╔╝░░░██║░░░░░░░░░██║░░██║██║░░░░░██║
  ╚═════╝░╚══════╝╚═╝░░░░░╚═╝░╚════╝░░░░░░░╚═╝░░╚═╝╚══════╝╚═════╝░░░░╚═╝░░░░░░░░░╚═╝░░╚═╝╚═╝░░░░░╚═╝

  e-mail: ridhuan@leetcat.com
 */

const { logger } = require('./libs/helper');

// Init Router
require('./routers').init();

// Init HTTPS server
const server = require('./libs/server').init();

// Shutdown process gracefully
function gracefulShutdown(signal) {
  logger.warn(`${signal} signal received`);
  logger.warn('Closing HTTPS server');

  server.close(() => {
    process.exit(0);
  });

  // if poll empty. emit close
  // https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#poll
  setImmediate(() => {
    server.emit('close');
  });
}

process.on('SIGINT', () => {
  gracefulShutdown('SIGINT');
});

process.on('SIGTERM', () => {
  gracefulShutdown('SIGTERM');
});
