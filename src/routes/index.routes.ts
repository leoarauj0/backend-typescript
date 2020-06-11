import { Router } from 'express';
import bodyParser from 'body-parser';

import appointmentsRouter from './appointments.routes';
import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';

const routes = Router();
const jsonParser = bodyParser.json();

routes.use('/appointments', jsonParser, appointmentsRouter);
routes.use('/users', jsonParser, usersRouter);
routes.use('/sessions', jsonParser, sessionsRouter);

export default routes;
