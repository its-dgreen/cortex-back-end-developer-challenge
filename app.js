import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { readFile } from 'fs/promises';
const swaggerFile = JSON.parse(
  await readFile(new URL('./openapi.json', import.meta.url))
);

const options = {
  swaggerDefinition: {
    info: {
      title: 'DDBeyond - Cortex Backend Developer Challenge',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);

import router from './routes/character.js';
import {
  notFound,
  logValidationErrors,
  developmentErrors,
  productionErrors,
} from './middleware/errors.js';

dotenv.config({ path: 'variables.env' });

// Connect to our Database and handle any bad connections
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/dndapi', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
console.info(`🧭 🧭 🧭 🧭 -> Connection to mongodb successful!`);
mongoose.connection.on('error', err => {
  console.error(`🚫 🚫 🚫 🚫 → ${err.message}`);
});

const app = express();

app.use(bodyParser.json());

app.use('/', router);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(notFound);
app.use(logValidationErrors);

if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(developmentErrors);
}

app.use(productionErrors);

// TODO: write tests

const server = app.listen(6789, () =>
  console.log('🚀 Server ready at: http://localhost:6789')
);
