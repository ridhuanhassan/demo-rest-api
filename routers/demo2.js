const router = require('../libs/router');
const cat = require('../controllers/cat');
const helper = require('../libs/helper');

const simple = Symbol.for('simple');

router.get('/cat/breeds', (req, res) => {
  cat.listBreeds()
    .then((breeds) => {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.write(JSON.stringify(breeds));
      res.end();
    })
    .catch((error) => {
      helper.sendErrorResponse(res, error.message, 400);
    });
});

router.get('/cat/breed/:breedId/images', (req, res) => {
  const input = {
    breedId: req[simple].params?.breedId,
    limit: req[simple].query?.limit,
    page: req[simple].query?.page,
  };

  cat.imageByBreed(input)
    .then((images) => {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.write(JSON.stringify(images));
      res.end();
    })
    .catch((error) => {
      helper.sendErrorResponse(res, error.message, 400);
    });
});

router.post('/cat/upload', (req, res) => {
  const input = {
    file: req[simple].files?.file,
  };

  cat.uploadImage(input)
    .then((images) => {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.write(images);
      res.end();
    })
    .catch((error) => {
      helper.sendErrorResponse(res, error.message, 400);
    });
});
