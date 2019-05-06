import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import router from './router.js';
import dbService from './db-service.js';

dbService.connectToMariaDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api", router);

app.listen(4000, () => console.log(`Express server running on port 4000`));
