import { Dayjs } from "dayjs";
export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface IAppointmentBasic {
  date: string;
  patient?: IUser;
  pharmacist?: IUser;
}

export interface IAvailabilityBasic {
  date: Dayjs;
  updatedAt: string;
  createdAt: string;
  id: number;
}
