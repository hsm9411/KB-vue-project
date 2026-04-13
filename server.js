import jsonServer from 'json-server';
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom Soft Delete Middleware (Global filter)
server.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/categories')) {
    // Automatically filter out inactive records by adding isActive=true to query
    req.query.isActive = 'true';
  }
  next();
});

// Middleware to prevent direct access to inactive resources via ID
server.use((req, res, next) => {
  if (req.method === 'GET' && req.params.id) {
    // This is a bit tricky with json-server middleware because params aren't parsed yet
  }
  next();
});

// Custom 404 & Error Handling Middleware
router.render = (req, res) => {
  const data = res.locals.data;

  // Logic for 404:
  // 1. Explicit 404 from json-server
  // 2. Resource found but has isActive: false (Soft Delete)
  const isSoftDeleted = data && typeof data === 'object' && data.isActive === false;
  const isNotFound = res.statusCode === 404 || isSoftDeleted;

  if (isNotFound) {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: '요청하신 데이터를 찾을 수 없습니다.'
      }
    });
  } else if (res.statusCode >= 400) {
    res.status(res.statusCode).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: '잘못된 요청입니다.'
      }
    });
  } else {
    res.json(data);
  }
};

server.use(router);
server.listen(3000, () => {
  console.log('JSON Server with Soft Delete and Custom Errors is running on port 3000');
});
