import { Dayjs } from "dayjs";
export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  doxyLink?: string;
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

export interface IMedication {
  id: number;
  name: string;
  dosage: string;
  instructions: string;
}

export interface IReferal {
  id: number;
  notes: string;
  diagnosis: string;
  referringDoctor: {
    firstName: string;
    lastName: string;
  };
}

export interface IPatient extends IUser {
  medications: IMedication[];
  referal: IReferal;
}

export interface INoteReport {
  content: string;
  referal: {
    pharmacist: IUser;
    patient: IUser;
  };
}
