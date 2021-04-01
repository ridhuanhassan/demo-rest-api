const qs = require('querystring');

const simple = Symbol.for('simple');

const router = (function () {
  const pathTree = {};

  function mapHandler(method, path, callback) {
    if (!path || !callback) {
      throw new Error('Path and callback is required');
    }

    if (typeof path !== 'string') {
      throw new Error('Path must be a string');
    }

    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    // remove forward slashes at start and end
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // get path segments
    const pathSegments = trimmedPath.split('/');

    // get params from path segments
    const params = {};
    pathSegments.forEach((pathSegment, index) => {
      // map param location and param value
      if (pathSegment.startsWith(':')) {
        params[index] = pathSegment;
      }
    });

    // determine depth
    const depth = trimmedPath === '' ? 0 : pathSegments.length;

    // is there any node at this depth?
    let depthNode = pathTree[depth];
    if (!depthNode) {
      pathTree[depth] = {};
      depthNode = pathTree[depth];
    }

    // is there any node for current method?
    const methodNode = depthNode[method.toUpperCase()];
    if (!methodNode) depthNode[method.toUpperCase()] = {};

    // convert path structure into regular expression
    // from this, sub1/:arg1/sub2/:arg2
    // to this  , ^\/sub1\/[^/]+\/sub2\/[^/]+\/?$

    // replace / to \/
    let regexString = trimmedPath.replace(/\//g, '\\/');

    // replace arguments with [^/]+
    regexString = regexString.replace(/:[^/\\]+/g, '[^/]+');

    // prepend /
    regexString = `^\\/${regexString}`;

    // append \/?$
    if (trimmedPath) regexString = `${regexString}\\/?$`;
    else regexString = `${regexString}$`;

    // check if regex already exist
    if (pathTree[depth][method.toUpperCase()]?.[regexString]) {
      throw new Error(`Path ${path} already exist.`);
    }

    // save new regex
    pathTree[depth][method.toUpperCase()][regexString] = {
      params,
      callback,
    };
  }

  return {
    // open private method for testing
    _mapHandler: mapHandler,
    _pathTree: pathTree,
    // function to map path and callback based on HTTP methods
    get: (path, callback) => mapHandler('GET', path, callback),
    post: (path, callback) => mapHandler('POST', path, callback),
    put: (path, callback) => mapHandler('PUT', path, callback),
    patch: (path, callback) => mapHandler('PATCH', path, callback),
    delete: (path, callback) => mapHandler('DELETE', path, callback),
    // process incoming HTTP requests
    process: (req, res) => {
      res.setHeader('X-Powered-By', 'Ridhuan Hassan');

      const simpleReq = req[simple];

      const pathSegments = simpleReq.trimmedPath.split('/');

      // find the right handler for current request
      const depth = simpleReq.trimmedPath === '' ? 0 : pathSegments.length;
      const handlers = pathTree[depth]?.[simpleReq.method.toUpperCase()];

      let handler;

      if (handlers) {
        const regexStrings = Object.keys(handlers);

        let i = 0;
        const iMax = regexStrings.length;
        for (; i < iMax; i += 1) {
          const regexString = regexStrings[i];

          const regex = new RegExp(regexString, 'g');
          // check if requested path existed
          if (regex.test(simpleReq.path)) {
            handler = handlers[regexString];
            break;
          }
        }
      }

      if (!handler) {
        res.statusCode = 404;
        res.write('404');
        return res.end();
      }

      const params = Object.keys(handler.params);

      let j = 0;
      const jMax = params.length;
      for (; j < jMax; j += 1) {
        if (!req.params) req.params = {};

        const param = params[j];
        req.params[handler.params[param]] = qs.unescape(pathSegments[param]);
      }

      return handler.callback(req, res);
    },
  };
}());

module.exports = router;
