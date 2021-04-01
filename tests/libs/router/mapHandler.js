/* eslint-disable no-undef */
const router = require('../../../libs/router');

describe('lib/router: Call function mapHandler()', () => {
  beforeEach(() => {
    // reset pathTree to empty {}
    Object.keys(router._pathTree)
      .forEach((key) => delete router._pathTree[key]);
  });

  test('no path and callback', () => {
    function mapHandler() {
      router._mapHandler('POST');
    }

    expect(mapHandler)
      .toThrowError(new Error('Path and callback is required'));
  });

  test('no callback', () => {
    function mapHandler() {
      router._mapHandler('POST', '/');
    }

    expect(mapHandler)
      .toThrowError(new Error('Path and callback is required'));
  });

  test('pass non string value as path', () => {
    function mapHandler() {
      router._mapHandler('POST', 2, (req, res) => {
        res.send('OK');
      });
    }

    expect(mapHandler)
      .toThrowError(new Error('Path must be a string'));
  });

  test('structure at depth = 0, no param, 1 callback', () => {
    router._mapHandler('POST', '/', (req, res) => {
      res.send('OK');
    });

    expect(router._pathTree).toMatchObject({
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
    router._mapHandler('POST', '/posts/', (req, res) => {
      res.send('OK');
    });

    expect(router._pathTree).toMatchObject({
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
    router._mapHandler('POST', '/user/:userId/', (req, res) => {
      res.send('OK');
    });

    expect(router._pathTree).toMatchObject({
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
    router._mapHandler('POST', '/user/:userId/settings/', (req, res) => {
      res.send('OK');
    });

    expect(router._pathTree).toMatchObject({
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
    router._mapHandler('POST', '/user/:userId/settings/:settingGroup/', (req, res) => {
      res.send('OK');
    });

    expect(router._pathTree).toMatchObject({
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
});
