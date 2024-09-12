import { create } from 'zustand';

import {
  clientEmergencyContactSChema,
  type ClientFormSchema,
  clientPersonalInformationSchema,
  goalsAndPreferenceSchema,
  healthAndFitnessSchema,
  paymentDetailSchema,
} from '@/validations/client/add-form.validation';
import { createMembershipPlanSchema } from '@/validations/client/membership.validation';

import type { MembershipPlan } from '../../../membership/types';

export type ClientFormState = Omit<ClientFormSchema, 'personalInformation' | 'membershipDetail'> & {
  personalInformation: Omit<ClientFormSchema['personalInformation'], 'dob'> & {
    dob: Date | undefined;
  };
  membershipDetail: ClientFormSchema['membershipDetail'] & {
    selectedPlan: MembershipPlan | null;
  };
};

export type ClientFormActions = {
  setPersonalInformation: (data: ClientFormState['personalInformation']) => void;
  setEmergencyContact: (data: ClientFormState['emergencyContact']) => void;
  setHealthAndFitness: (data: ClientFormState['healthAndFitness']) => void;
  setMembershipDetail: (data: ClientFormState['membershipDetail']) => void;
  setPaymentDetail: (data: ClientFormState['paymentDetail']) => void;
  setGoalsAndPreferences: (data: ClientFormState['goalsAndPreference']) => void;
  setConsentAndAgreement: (data: ClientFormState['consentAndAgreement']) => void;
  updatePersonalInformation: (data: Partial<ClientFormState['personalInformation']>) => void;
  updateEmergencyContact: (data: Partial<ClientFormState['emergencyContact']>) => void;
  updateHealthAndFitness: (data: Partial<ClientFormState['healthAndFitness']>) => void;
  updateMembershipDetail: (data: Partial<ClientFormState['membershipDetail']>) => void;
  updatePaymentDetail: (data: Partial<ClientFormState['paymentDetail']>) => void;
  updateGoalsAndPreferences: (data: Partial<ClientFormState['goalsAndPreference']>) => void;
  updateConsentAndAgreement: (data: Partial<ClientFormState['consentAndAgreement']>) => void;
  resetClientForm: () => void;
};
export type ClientFormStore = ClientFormState & ClientFormActions;

const defaultValues: ClientFormState = {
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
  },
  healthAndFitness: {
    height: 0,
    weight: 0,
    medicalCondition: '',
    allergy: '',
    injury: '',
    fitnessLevel: healthAndFitnessSchema.shape.fitnessLevel.enum.BEGINNER,
  },
  goalsAndPreference: {
    fitnessGoals: [],
    classPreference: goalsAndPreferenceSchema.shape.classPreference.enum.WEEK_DAY,
    classTimePreference: '',
    additionalServices: [],
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
  consentAndAgreement: {
    termsAndConditions: false,
    privacyPolicy: false,
    websAppCommunication: false,
    promotionalCommunication: false,
    signature: {
      name: '',
      provider: '',
    },
  },
};
export const useClientFormStore = create<ClientFormStore>()(set => ({
  ...defaultValues,
  setPersonalInformation: data => set({ personalInformation: data }),
  setEmergencyContact: data => set({ emergencyContact: data }),
  setHealthAndFitness: data => set({ healthAndFitness: data }),
  setMembershipDetail: data => set({ membershipDetail: data }),
  setPaymentDetail: data => set({ paymentDetail: data }),
  setGoalsAndPreferences: data => set({ goalsAndPreference: data }),
  setConsentAndAgreement: data => set({ consentAndAgreement: data }),
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
  updateGoalsAndPreferences: data =>
    set(state => ({ goalsAndPreference: { ...state.goalsAndPreference, ...data } })),
  updateConsentAndAgreement: data =>
    set(state => ({ consentAndAgreement: { ...state.consentAndAgreement, ...data } })),
  resetClientForm: () => set(defaultValues),
}));

export const usePersonalInformation = () => useClientFormStore(state => state.personalInformation);
export const useEmergencyContact = () => useClientFormStore(state => state.emergencyContact);
export const useClientHealthAndFitness = () => useClientFormStore(state => state.healthAndFitness);
export const useClientMemberShipDetail = () => useClientFormStore(state => state.membershipDetail);
export const useClientPaymentDetail = () => useClientFormStore(state => state.paymentDetail);
export const useClientGoalsAndPreferences = () =>
  useClientFormStore(state => state.goalsAndPreference);
export const useClientConsentAndAgreement = () =>
  useClientFormStore(state => state.consentAndAgreement);

export const useClientFormState = () => {
  return useClientFormStore(state => {
    return state;
  });
};
