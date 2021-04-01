/* eslint-disable no-undef */
const router = require('../../../libs/router');

describe('lib/router: Insert router', () => {
  beforeEach(() => {
    // reset routerTree to empty {}
    Object.keys(router._routerTree)
      .forEach((key) => delete router._routerTree[key]);
  });

  test('no path and callback', () => {
    function insertRouter() {
      router._insertRouter('POST');
    }

    expect(insertRouter)
      .toThrowError(new Error('Path and callback is required'));
  });

  test('no callback', () => {
    function insertRouter() {
      router._insertRouter('POST', '/');
    }

    expect(insertRouter)
      .toThrowError(new Error('Path and callback is required'));
  });

  test('pass non string value as path', () => {
    function insertRouter() {
      router._insertRouter('POST', 2, (req, res) => {
        res.send('OK');
      });
    }

    expect(insertRouter)
      .toThrowError(new Error('Path must be a string'));
  });

  test('structure at depth = 0, no param, 1 callback', () => {
    router._insertRouter('POST', '/', (req, res) => {
      res.send('OK');
    });

    expect(router._routerTree).toMatchObject({
      0: {
        POST: {
          '^\\/$': {
            params: {},
            callback: expect.any(Function),
          },
        },
      },
    });
  });

  test('structure at depth = 1, no param, 1 callback', () => {
    router._insertRouter('POST', '/posts/', (req, res) => {
      res.send('OK');
    });

    expect(router._routerTree).toMatchObject({
      1: {
        POST: {
          '^\\/posts\\/?$': {
            params: {},
            callback: expect.any(Function),
          },
        },
      },
    });
  });

  test('structure at depth = 2, 1 param, 1 callback', () => {
    router._insertRouter('POST', '/user/:userId/', (req, res) => {
      res.send('OK');
    });

    expect(router._routerTree).toMatchObject({
      2: {
        POST: {
          '^\\/user\\/[^/]+\\/?$': {
            params: {
              1: ':userId',
            },
            callback: expect.any(Function),
          },
        },
      },
    });
  });

  test('structure at depth = 3, 1 param, 1 callback', () => {
    router._insertRouter('POST', '/user/:userId/settings/', (req, res) => {
      res.send('OK');
    });

    expect(router._routerTree).toMatchObject({
      3: {
        POST: {
          '^\\/user\\/[^/]+\\/settings\\/?$': {
            params: {
              1: ':userId',
            },
            callback: expect.any(Function),
          },
        },
      },
    });
  });

  test('structure at depth = 4, 2 params, 1 callback', () => {
    router._insertRouter('POST', '/user/:userId/settings/:settingGroup/', (req, res) => {
      res.send('OK');
    });

    expect(router._routerTree).toMatchObject({
      4: {
        POST: {
          '^\\/user\\/[^/]+\\/settings\\/[^/]+\\/?$': {
            params: {
              1: ':userId',
              3: ':settingGroup',
            },
            callback: expect.any(Function),
          },
        },
      },
    });
  });

  test('insert router from http method functions', () => {
    router.get('/user/', (req, res) => {
      res.send('OK');
    });

    router.post('/post/', (req, res) => {
      res.send('OK');
    });

    router.put('/post/:postId/', (req, res) => {
      res.send('OK');
    });

    router.patch('/post/:postId/', (req, res) => {
      res.send('OK');
    });

    router.delete('/post/:postId/', (req, res) => {
      res.send('OK');
    });

    expect(router._routerTree).toMatchObject({
      1: {
        GET: {
          '^\\/user\\/?$': {
            params: {},
            callback: expect.any(Function),
          },
        },
        POST: {
          '^\\/post\\/?$': {
            params: {},
            callback: expect.any(Function),
          },
        },
      },
      2: {
        PUT: {
          '^\\/post\\/[^/]+\\/?$': {
            params: {
              1: ':postId',
            },
            callback: expect.any(Function),
          },
        },
        PATCH: {
          '^\\/post\\/[^/]+\\/?$': {
            params: {
              1: ':postId',
            },
            callback: expect.any(Function),
          },
        },
        DELETE: {
          '^\\/post\\/[^/]+\\/?$': {
            params: {
              1: ':postId',
            },
            callback: expect.any(Function),
          },
        },
      },
    });
  });
});
