import express from 'express';
import path from 'path';
import cors from 'cors';

import routes from './routes';

const app = express();

app.use(cors({
  // origin: 'http://localhost:3000',
}));

app.use(express.json());

app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(4001, () => {
  console.log('------------------------------------------------------------------------------------------');
  console.log('Server: Listening on port 4001');
  console.log('------------------------------------------------------------------------------------------');
});