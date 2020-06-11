/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import { startOfHour } from 'date-fns';

import { getCustomRepository } from 'typeorm';

import AppError from '../../../errors/AppError';


import Appointment from '../../../models/Appointment';
import AppointmentsRepository from '../../../repositories/AppointmentsRepository';


interface RequestDTO {
  provider_id: string;
  date: Date;
}


class CreateAppointmentService {
  public async execute({ date, provider_id }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(appointmentDate);

    if (findAppointmentInSameDate) {
      throw new AppError('Esse agendamento está bloqueado. Já existe um agendamento para esta data');
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
