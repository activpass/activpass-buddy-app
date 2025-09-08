import type { ValueOf } from '@paalan/react-shared/types';
import { create } from 'zustand';

import {
  clientEmergencyContactSChema,
  type ClientFormSchema,
  clientPersonalInformationSchema,
  healthAndFitnessSchema,
  paymentDetailSchema,
} from '@/validations/client/add-form.validation';
import { createMembershipPlanSchema } from '@/validations/client/membership.validation';

import type { MembershipPlan } from '../../../../membership/types';
import { ADD_CLIENT_STEP_ID } from './constants';

export type ClientFormState = Omit<ClientFormSchema, 'personalInformation' | 'membershipDetail'> & {
  currentStep: ValueOf<typeof ADD_CLIENT_STEP_ID>;
  personalInformation: Omit<ClientFormSchema['personalInformation'], 'dob'> & {
    dob: Date | undefined;
  };
  membershipDetail: ClientFormSchema['membershipDetail'] & {
    selectedPlan: MembershipPlan | null;
  };
  onboardingData: {
    membershipPlans: MembershipPlan[];
    onboardClientId: string;
    organization: {
      name: string;
      type: string;
      id: string;
    } | null;
  };
};

export type ClientFormActions = {
  setCurrentStep: (step: ClientFormState['currentStep']) => void;
  nextStep: () => void;
  prevStep: () => void;
  setPersonalInformation: (data: ClientFormState['personalInformation']) => void;
  setEmergencyContact: (data: ClientFormState['emergencyContact']) => void;
  setHealthAndFitness: (data: ClientFormState['healthAndFitness']) => void;
  setMembershipDetail: (data: ClientFormState['membershipDetail']) => void;
  setPaymentDetail: (data: ClientFormState['paymentDetail']) => void;
  updatePersonalInformation: (data: Partial<ClientFormState['personalInformation']>) => void;
  updateEmergencyContact: (data: Partial<ClientFormState['emergencyContact']>) => void;
  updateHealthAndFitness: (data: Partial<ClientFormState['healthAndFitness']>) => void;
  updateMembershipDetail: (data: Partial<ClientFormState['membershipDetail']>) => void;
  updatePaymentDetail: (data: Partial<ClientFormState['paymentDetail']>) => void;
  resetClientForm: () => void;
  setOnboardingData: (data: ClientFormState['onboardingData']) => void;
};
export type ClientFormStore = ClientFormState & ClientFormActions;

const defaultValues: ClientFormState = {
  currentStep: ADD_CLIENT_STEP_ID.CLIENT_INFORMATION,
  personalInformation: {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: 0,
    dob: undefined,
    address: '',
    gender: clientPersonalInformationSchema.shape.gender.enum.MEN,
    avatar: null,
  },
  emergencyContact: {
    name: '',
    relationship: clientEmergencyContactSChema.shape.relationship.enum.PARENT,
    phoneNumber: 0,
    email: '',
    address: '',
    gender: clientEmergencyContactSChema.shape.gender.enum.MEN,
  },
  healthAndFitness: {
    height: 0,
    weight: 0,
    fitnessLevel: healthAndFitnessSchema.shape.fitnessLevel.enum.BEGINNER,
    fitnessGoals: [],
    classPreference: healthAndFitnessSchema.shape.classPreference.enum.WEEK_DAY,
    classTimePreference: '',
    instructorSupport: false,
    fitnessAssessment: true,
  },
  membershipDetail: {
    tenure: createMembershipPlanSchema.shape.tenure.enum.MONTHLY,
    planId: '',
    selectedPlan: null,
  },
  paymentDetail: {
    paymentFrequency: paymentDetailSchema.shape.paymentFrequency.enum.ONE_TIME,
    paymentMethod: paymentDetailSchema.shape.paymentMethod.enum.CASH,
    paymentStatus: paymentDetailSchema.shape.paymentStatus.enum.PENDING,
  },
  onboardingData: {
    membershipPlans: [],
    onboardClientId: '',
    organization: null,
  },
};
export const useClientFormStore = create<ClientFormStore>()(set => ({
  ...defaultValues,
  setCurrentStep: step => set({ currentStep: step }),
  nextStep: () => {
    set(state => {
      const steps = Object.values(ADD_CLIENT_STEP_ID);
      const currentIndex = steps.indexOf(state.currentStep);
      const nextIndex = Math.min(currentIndex + 1, steps.length - 1);
      return { currentStep: steps[nextIndex] };
    });
  },
  prevStep: () => {
    set(state => {
      const steps = Object.values(ADD_CLIENT_STEP_ID);
      const currentIndex = steps.indexOf(state.currentStep);
      const prevIndex = Math.max(currentIndex - 1, 0);
      return { currentStep: steps[prevIndex] };
    });
  },
  setPersonalInformation: data => set({ personalInformation: data }),
  setEmergencyContact: data => set({ emergencyContact: data }),
  setHealthAndFitness: data => set({ healthAndFitness: data }),
  setMembershipDetail: data => set({ membershipDetail: data }),
  setPaymentDetail: data => set({ paymentDetail: data }),
  updatePersonalInformation: data =>
    set(state => ({ personalInformation: { ...state.personalInformation, ...data } })),
  updateEmergencyContact: data =>
    set(state => ({ emergencyContact: { ...state.emergencyContact, ...data } })),

  updateHealthAndFitness: data =>
    set(state => ({ healthAndFitness: { ...state.healthAndFitness, ...data } })),
  updateMembershipDetail: data =>
    set(state => ({ membershipDetail: { ...state.membershipDetail, ...data } })),
  updatePaymentDetail: data =>
    set(state => ({ paymentDetail: { ...state.paymentDetail, ...data } })),
  resetClientForm: () => set(defaultValues),
  setOnboardingData: data => set({ onboardingData: data }),
}));

export const usePersonalInformation = () => useClientFormStore(state => state.personalInformation);
export const useEmergencyContact = () => useClientFormStore(state => state.emergencyContact);
export const useClientHealthAndFitness = () => useClientFormStore(state => state.healthAndFitness);
export const useClientMemberShipDetail = () => useClientFormStore(state => state.membershipDetail);
export const useClientPaymentDetail = () => useClientFormStore(state => state.paymentDetail);

export const useClientFormState = () => {
  return useClientFormStore(state => {
    return state;
  });
};
