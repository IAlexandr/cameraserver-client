import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import webpackConfig from './webpack.config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './lib/router';
// import auth from './lib/auth';

const app = express();
app.use(cors({origin: true}));
// auth(app);

app.use(bodyParser.json({ limit: '1024mb' }));

app.use(router);

const httpServer = http.Server(app);

webpackConfig.output.path = '/';

const compiler = webpack(webpackConfig);

const server = new WebpackDevServer(compiler, {
  contentBase: './dist',
  hot: true,
  historyApiFallback: true,
  proxy: {
    '/api/*': 'http://localhost:4000'
  }
});

server.listen(7777, () => {
  httpServer.listen(4000);
/* eslint-disable no-console */
console.log('App server listening on port 7777');
console.log('Build app...');

/* eslint-enable no-console */
});
