const helper = {};

helper.checkImageSignature = (buffer, filename) => {
  const imageSignatures = {
    jpg: [
      {
        buffer: Buffer.from('FFD8FFDB', 'hex'),
        offset: 0,
        length: 4,
      },
      {
        buffer: Buffer.from('FFD8FFE000104A4649460001', 'hex'),
        offset: 0,
        length: 12,
      },
      {
        buffer: Buffer.from('FFD8FFEE', 'hex'),
        offset: 0,
        length: 4,
      },
      {
        buffer: Buffer.from('FFD8FFE1????457869660000', 'hex'),
        offset: 0,
        length: 12,
      },
    ],
    png: [
      {
        buffer: Buffer.from('89504E470D0A1A0A', 'hex'),
        offset: 0,
        length: 8,
      },
    ],
    gif: [
      {
        buffer: Buffer.from('474946383761', 'hex'),
        offset: 0,
        length: 6,
      },
      {
        buffer: Buffer.from('474946383961', 'hex'),
        offset: 0,
        length: 6,
      },
    ],
  };

  let result = false;

  const extension = filename.match(/\.(\w+$)/);

  const imageSignature = imageSignatures[extension[1]];

  let i = 0;
  const iMax = imageSignature.length;
  for (; i < iMax; i += 1) {
    const variant = imageSignature[i];
    const int = buffer
      .slice(variant.offset, variant.length)
      .compare(variant.buffer);

    if (int === 0) {
      result = true;
      break;
    }
  }

  return result;
};

helper.getContentType = (url) => {
  // limited mime for demo
  const contentTypes = {
    // images
    gif: 'image/gif',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    // documents
    csv: 'text/csv',
    pdf: 'application/pdf',
    ppt: 'application/vnd.ms-powerpoint',
    pttx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // html
    htm: 'text/html; charset=utf-8',
    html: 'text/html; charset=utf-8',
    // css
    css: 'text/css; charset=utf-8',
    // js
    js: 'text/javascript; charset=utf-8',
  };

  const extension = url.match(/\.(\w+$)/);

  if (extension && contentTypes[extension[1]]) {
    return contentTypes[extension[1]];
  }

  return '';
};

helper.sendErrorResponse = (res, message, statusCode) => {
  res.setHeader('content-type', 'application/json');
  res.statusCode = statusCode;
  return res.end(JSON.stringify({
    error: {
      message,
    },
  }));
};

helper.logger = (function () {
  const print = (type, message) => {
    const tag = {
      INFO: '\x1b[1;4;38;5;111mINFO\x1b[0m',
      WARN: '\x1b[1;4;38;5;215mWARN\x1b[0m',
      ERROR: '\x1b[1;4;38;5;167mERROR\x1b[0m',
    };

    process.stdout.write(`${tag[type]}\t: ${message}\n`);
  };

  return {
    info: (message) => print('INFO', message),
    warn: (message) => print('WARN', message),
    error: (message) => print('ERROR', message),
  };
}());

module.exports = helper;
