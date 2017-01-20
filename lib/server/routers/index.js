// import options from '../../../options';
// import camerasRouter from './cameras';
// import cameracodersRouter from './cameracoders';
// import { Router } from 'express';
//
// const routers = [
//   camerasRouter,
//   cameracodersRouter,
// ];
//
// const mainRouter = Router();
//
// mainRouter.get('/', function (req, res) {
//   res.json({
//     version: options.version
//   });
// });
//
// const root = '/api/';
//
// export default (app) => {
//   app.use(root, mainRouter);
//   routers.forEach((r) => {
//     const { route, router } = r;
//     app.use(root + route, router);
//   });
// };
