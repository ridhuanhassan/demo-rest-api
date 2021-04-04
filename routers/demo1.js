const router = require('../libs/router');

router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.write(JSON.stringify({
    status: 200,
    message: 'Demo REST API',
  }));
  res.end();
});
