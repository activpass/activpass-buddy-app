import type { ValueOf } from '@paalan/react-shared/types';
import { create } from 'zustand';

import {
  GenderEnum,
  type PersonalInformationFormSchema,
  RelationshipEnum,
} from '@/validations/employee/add-form.validation';

import { ADD_EMPLOYEE_STEP_ID } from './constants';
import type { JobDetailsFormData } from './stepper-forms/JobDetailsForm/fields';
import type { PaymentDetailsFormData } from './stepper-forms/PaymentDetailsForm/fields';

// Define simplified employee form state for the stepper
export type EmployeeFormState = {
  currentStep: ValueOf<typeof ADD_EMPLOYEE_STEP_ID>;
  personalInformation: Omit<PersonalInformationFormSchema, 'dob'> & {
    dob: Date | string | undefined;
  };
  jobDetails: JobDetailsFormData;
  paymentDetails: PaymentDetailsFormData;
  onboardingData?: {
    token: string | undefined;
    organization:
      | {
          id: string;
          name: string;
          type: string;
        }
      | undefined;
  };
};

export type EmployeeFormActions = {
  setCurrentStep: (step: EmployeeFormState['currentStep']) => void;
  nextStep: () => void;
  prevStep: () => void;
  setPersonalInformation: (data: EmployeeFormState['personalInformation']) => void;
  setJobDetails: (data: EmployeeFormState['jobDetails']) => void;
  setPaymentDetails: (data: EmployeeFormState['paymentDetails']) => void;
  updatePersonalInformation: (data: Partial<EmployeeFormState['personalInformation']>) => void;
  updateJobDetails: (data: Partial<EmployeeFormState['jobDetails']>) => void;
  updatePaymentDetails: (data: Partial<EmployeeFormState['paymentDetails']>) => void;
  resetEmployeeForm: () => void;
  setOnboardingData: (data: EmployeeFormState['onboardingData']) => void;
};

export type EmployeeFormStore = EmployeeFormState & EmployeeFormActions;

const defaultValues: EmployeeFormState = {
  currentStep: ADD_EMPLOYEE_STEP_ID.PERSONAL_INFORMATION,
  personalInformation: {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: 0,
    gender: GenderEnum.enum.MEN,
    dob: undefined,
    address: '',
    emergencyContact: {
      name: '',
      relationship: RelationshipEnum.enum.PARENT,
      phoneNumber: 0,
      gender: GenderEnum.enum.MEN,
    },
  },
  jobDetails: {
    title: '',
    department: '',
    description: '',
    salary: '',
    workSchedule: {
      shiftStartTime: '',
      shiftEndTime: '',
      breakHours: 0,
      entitledHolidays: 0,
    },
  },
  paymentDetails: {
    bank: {
      name: '',
      branchName: '',
      accountHolderName: '',
      accountNumber: 0,
      ifscCode: '',
    },
    dateOfSalary: '',
  },

  onboardingData: undefined,
};

export const useEmployeeFormStore = create<EmployeeFormStore>()(set => ({
  ...defaultValues,
  setCurrentStep: step => set({ currentStep: step }),
  nextStep: () => {
    set(state => {
      const steps = Object.values(ADD_EMPLOYEE_STEP_ID);
      const currentIndex = steps.indexOf(state.currentStep);
      const nextIndex = Math.min(currentIndex + 1, steps.length - 1);
      return { currentStep: steps[nextIndex] };
    });
  },
  prevStep: () => {
    set(state => {
      const steps = Object.values(ADD_EMPLOYEE_STEP_ID);
      const currentIndex = steps.indexOf(state.currentStep);
      const prevIndex = Math.max(currentIndex - 1, 0);
      return { currentStep: steps[prevIndex] };
    });
  },
  setPersonalInformation: data => set({ personalInformation: data }),
  setJobDetails: data => set({ jobDetails: data }),
  setPaymentDetails: data => set({ paymentDetails: data }),
  updatePersonalInformation: data =>
    set(state => ({ personalInformation: { ...state.personalInformation, ...data } })),
  updateJobDetails: data => set(state => ({ jobDetails: { ...state.jobDetails, ...data } })),
  updatePaymentDetails: data =>
    set(state => ({ paymentDetails: { ...state.paymentDetails, ...data } })),
  resetEmployeeForm: () => set(defaultValues),
  setOnboardingData: data => set({ onboardingData: data }),
}));

export const useEmployeePersonalInformation = () =>
  useEmployeeFormStore(state => state.personalInformation);
export const useEmployeeJobDetails = () => useEmployeeFormStore(state => state.jobDetails);
export const useEmployeePaymentDetails = () => useEmployeeFormStore(state => state.paymentDetails);

export const useEmployeeFormState = () => {
  return useEmployeeFormStore(state => state);
};
