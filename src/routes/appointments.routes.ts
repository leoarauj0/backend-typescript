import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import { parseISO } from 'date-fns';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../modules/appointments/services/CreateAppointmentService';

import Autenticado from '../middlewares/Autenticado';

const appointmentsRouter = Router();

appointmentsRouter.use(Autenticado);


appointmentsRouter.get('/', async (req, res) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find();

  return res.json(appointments);
});


appointmentsRouter.post('/', async (req, res) => {
  const { provider_id, date } = req.body;


  const parsedDate = parseISO(date);

  const createAppointment = new CreateAppointmentService();

  const appointment = await createAppointment.execute({ date: parsedDate, provider_id });

  return res.json(appointment);
});

export default appointmentsRouter;
