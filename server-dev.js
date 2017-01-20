import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import webpackConfig from './webpack.config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './router';
import options from './options';

const app = express();
app.use(cors({origin: true}));

app.use(bodyParser.json({ limit: '1024mb' }));

const httpServer = http.Server(app);

app.use('/static', express.static('static'));
app.use('/api', router);

webpackConfig.output.path = '/';

const compiler = webpack(webpackConfig);

const server = new WebpackDevServer(compiler, {
  contentBase: './dist',
  hot: true,
  historyApiFallback: true,
  proxy: {
    '/api/*': 'http://localhost:8001'
  }
});

server.listen(options.DASH_CLIENT_PORT, () => {
  httpServer.listen(8001);

  console.log('App server listening on port', options.DASH_CLIENT_PORT);
  console.log('Build app...');
});
