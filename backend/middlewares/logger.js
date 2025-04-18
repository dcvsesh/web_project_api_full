const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const requestLogStream = fs.createWriteStream(
  path.join(logDir, 'request.log'),
  { flags: 'a' }
);

const errorLogStream = fs.createWriteStream(
  path.join(logDir, 'error.log'),
  { flags: 'a' }
);

const logRequest = (req) => {
  const logEntry = JSON.stringify({
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    params: req.params,
    query: req.query,
    body: req.body,
    ip: req.ip
  });
  requestLogStream.write(`${logEntry}\n`);
};

const logError = (error) => {
  const logEntry = JSON.stringify({
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    }
  });
  errorLogStream.write(`${logEntry}\n`);
};

module.exports = { logRequest, logError };