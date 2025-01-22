import express from 'express';
import bodyParser from 'body-parser';

const setupRouter = () => {
  const router = express.Router();
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json());
  return router;
};

export default setupRouter;
