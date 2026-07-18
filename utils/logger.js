/**
 * Logger sederhana dengan format: [ISO timestamp] [LEVEL] [SCOPE] pesan
 */
function timestamp() {
  return new Date().toISOString();
}

function info(scope, message) {
  console.log(`[${timestamp()}] [INFO]  [${scope}] ${message}`);
}

function warn(scope, message) {
  console.warn(`[${timestamp()}] [WARN]  [${scope}] ${message}`);
}

function error(scope, message, err) {
  console.error(`[${timestamp()}] [ERROR] [${scope}] ${message}`);
  if (err?.stack) {
    console.error(err.stack);
  } else if (err) {
    console.error(err);
  }
}

module.exports = { info, warn, error };
