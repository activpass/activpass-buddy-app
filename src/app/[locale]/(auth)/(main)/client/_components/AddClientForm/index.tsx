'use client';

import {
  Avatar,
  Button,
  Checkbox,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  Input,
  Label,
  RadioGroupRoot,
  RadioGroupRootItem,
  Select,
  Step,
  type StepItem,
  Stepper,
  type StepperProps,
  useStepper,
} from '@paalan/react-ui';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
// import { z } from 'zod';

const steps: StepItem[] = [
  { label: 'Client Information' },
  { label: 'Health and Fitness' },
  { label: 'Goals and Preferences' },
  { label: 'Membership Details' },
  { label: 'Payment Details' },
  { label: 'Consent and Agreements' },
];

// const VALIDATIONS = {
//   required: z.string().min(1, { message: 'This field is required.' }),
//   minLength: (length: number) =>
//     z.string().min(length, { message: `Must be at least ${length} characters long.` }),
//   phoneNumber: z
//     .string()
//     .min(10, { message: 'Phone number must be exactly 10 digits.' })
//     .max(10, { message: 'Phone number must be exactly 10 digits.' }),
//   email: z.string().email({ message: 'Invalid email address.' }),
//   arrayOfString: z.array(z.string()).min(1, { message: 'Array must have at least one string.' }),
//   requiredBoolTrue: z
//     .boolean()
//     .refine(val => val === true, { message: 'This checkbox is required.' }),
//   membership: z.string().min(1, { message: 'Please select a membership plan from above list.' }),
// };

// const checkAndParse = (conditions: any[], field: any) => {
//   for (const condition of conditions) {
//     const result = condition.safeParse(field);
//     if (!result.success) return result.error.errors[0].message;
//   }
//   return null;
// };

// function checkValid(fieldsState: any, step: number) {
//   let errors: any = {};
//   if (step === 0) {
//     errors = {
//       firstName: checkAndParse([VALIDATIONS.minLength(3)], fieldsState.firstName),
//       lastName: checkAndParse([VALIDATIONS.required], fieldsState.lastName),
//       designation: checkAndParse([VALIDATIONS.required], fieldsState.designation),
//       gender: checkAndParse([VALIDATIONS.required], fieldsState.gender),
//       dob: checkAndParse([VALIDATIONS.required], fieldsState.dob),
//       phoneNumber: checkAndParse([VALIDATIONS.phoneNumber], fieldsState.phoneNumber),
//       email: checkAndParse([VALIDATIONS.email], fieldsState.email),
//       address: checkAndParse([VALIDATIONS.minLength(10)], fieldsState.address),
//       'emergencyContact.name': checkAndParse(
//         [VALIDATIONS.required],
//         fieldsState.emergencyContact.name
//       ),
//       'emergencyContact.relationship': checkAndParse(
//         [VALIDATIONS.required],
//         fieldsState.emergencyContact.relationship
//       ),
//       'emergencyContact.phoneNumber': checkAndParse(
//         [VALIDATIONS.phoneNumber],
//         fieldsState.emergencyContact.phoneNumber
//       ),
//       'emergencyContact.email': checkAndParse(
//         [VALIDATIONS.email],
//         fieldsState.emergencyContact.email
//       ),
//       'emergencyContact.address': checkAndParse(
//         [VALIDATIONS.required, VALIDATIONS.minLength(10)],
//         fieldsState.emergencyContact.address
//       ),
//     };
//   } else if (step === 1) {
//     errors = {
//       height: checkAndParse([VALIDATIONS.required], fieldsState.healthFitness.height),
//       weight: checkAndParse([VALIDATIONS.required], fieldsState.healthFitness.weight),
//       medicalConditions: checkAndParse(
//         [VALIDATIONS.required],
//         fieldsState.healthFitness.medicalConditions
//       ),
//       allergies: checkAndParse([VALIDATIONS.required], fieldsState.healthFitness.allergies),
//       injuries: checkAndParse([VALIDATIONS.required], fieldsState.healthFitness.injuries),
//       currentFitnessLevel: checkAndParse(
//         [VALIDATIONS.required],
//         fieldsState.healthFitness.currentFitnessLevel
//       ),
//     };
//   } else if (step === 2) {
//     errors = {
//       fitnessGoals: checkAndParse(
//         [VALIDATIONS.required],
//         fieldsState.goalsPreferences.fitnessGoals
//       ),
//       dayPreference: checkAndParse(
//         [VALIDATIONS.required],
//         fieldsState.goalsPreferences.dayPreference
//       ),
//       timePreference: checkAndParse(
//         [VALIDATIONS.required],
//         fieldsState.goalsPreferences.timePreference
//       ),
//       instructorPreference: checkAndParse(
//         [VALIDATIONS.required],
//         fieldsState.goalsPreferences.instructorPreference
//       ),
//       additionalService: checkAndParse(
//         [VALIDATIONS.required],
//         fieldsState.goalsPreferences.additionalService
//       ),
//       otherService:
//         fieldsState.goalsPreferences.additionalService === 'others'
//           ? checkAndParse([VALIDATIONS.required], fieldsState.goalsPreferences.otherService)
//           : null,
//     };
//   } else if (step === 3) {
//     errors = {
//       membership: checkAndParse([VALIDATIONS.membership], fieldsState.membership),
//     };
//   } else if (step === 4) {
//     errors = {
//       paymentStatus: checkAndParse([VALIDATIONS.required], fieldsState.paymentStatus),
//       paymentMode: checkAndParse([VALIDATIONS.required], fieldsState.paymentMode),
//     };
//   } else if (step === 5) {
//     errors = {
//       terms: checkAndParse([VALIDATIONS.requiredBoolTrue], fieldsState.terms),
//       signature: checkAndParse([VALIDATIONS.required], fieldsState.signature),
//     };
//   }
//   return errors;
// }

const Footer = () => {
  const { nextStep, prevStep, isDisabledStep, isLastStep } = useStepper();
  return (
    <div className="flex w-full justify-end gap-2">
      <Button disabled={isDisabledStep} onClick={prevStep} size="sm">
        Prev
      </Button>
      <Button size="sm" onClick={nextStep}>
        {isLastStep ? 'Finish' : 'Next'}
      </Button>
    </div>
  );
};

const AddClientForm = () => {
  const [orientation, setOrientation] = useState<StepperProps['orientation']>('vertical');
  const [formState, setFormState] = useState({
    avatar: 'https://github.com/shadcn.png',
    firstName: '',
    lastName: '',
    designation: '',
    gender: '',
    dob: '',
    email: '',
    phoneNumber: '',
    address: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phoneNumber: '',
      email: '',
      address: '',
    },
    healthFitness: {
      height: '',
      weight: '',
      medicalConditions: '',
      allergies: '',
      injuries: '',
      currentFitnessLevel: '',
    },
    goalsPreferences: {
      fitnessGoals: '',
      dayPreference: '',
      timePreference: new Date().toISOString().substring(0, 16),
      instructorPreference: '',
      additionalService: '',
      otherService: '',
      fitnessAssessment: '',
    },
    membership: '',
    paymentStatus: '',
    paymentMode: '',
    cycle: '',
    terms: false,
  });

  const DayPreferenceDisplay = {
    weekDay: 'WeekDay (Monday-Friday)',
    weekEnd: 'WeekEnd (Saturday-Sunday)',
    days: 'Days (Monday-Sunday)',
  };

  const AdditionalServiceDisplay = {
    nutritionalCounselling: 'Nutritional Counselling',
    dietPlan: 'Diet Plan',
    supplementAdvice: 'Supplement Advice',
    personalTraining: 'Personal Training',
    wellnessCoaching: 'Wellness Coaching',
    injuryRehabilitation: 'Injury Rehabilitation',
    stressManagement: 'Stress Management',
    others: 'Others',
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormState(prevState => ({
        ...prevState,
        [name]: checked,
      }));
    } else {
      setFormState(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState(prevState => ({
      ...prevState,
      healthFitness: {
        ...prevState.healthFitness,
        [name]: value,
      },
    }));
  };

  const renderStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <div className="">
            <h2 className="my-4 font-bold">Personal Information</h2>
            <div className="grid gap-5 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              <Avatar src={formState.avatar} alt="User Avatar" />
              <Input
                name="firstName"
                type="text"
                placeholder="First Name"
                value={formState.firstName}
                onChange={handleInputChange}
              />
              <Input
                name="lastName"
                type="text"
                placeholder="Last Name"
                value={formState.lastName}
                onChange={handleInputChange}
              />
              <Input
                name="designation"
                type="text"
                placeholder="Designation"
                value={formState.designation}
                onChange={handleInputChange}
              />
              <DropdownMenuRoot>
                <DropdownMenuTrigger asChild>
                  <Button>{formState.gender || 'Select Gender'}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onSelect={() => setFormState(prevState => ({ ...prevState, gender: 'Male' }))}
                  >
                    Male
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setFormState(prevState => ({ ...prevState, gender: 'Female' }))}
                  >
                    Female
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuRoot>
              <Input
                name="dob"
                type="date"
                placeholder="Date of Birth"
                value={formState.dob}
                onChange={handleInputChange}
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={formState.email}
                onChange={handleInputChange}
              />
              <Input
                name="phoneNumber"
                type="text"
                placeholder="Contact Number"
                value={formState.phoneNumber}
                onChange={handleInputChange}
              />
              <Input
                name="address"
                type="text"
                placeholder="Address"
                value={formState.address}
                onChange={handleInputChange}
              />
            </div>
            <h2 className="my-4 font-bold">Emergency Contact Information</h2>
            <div className="grid gap-5 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              <Input
                name="emergencyContact.name"
                type="text"
                placeholder="Name"
                value={formState.emergencyContact.name}
                onChange={handleInputChange}
              />
              <Input
                name="emergencyContact.relationship"
                type="text"
                placeholder="Relationship"
                value={formState.emergencyContact.relationship}
                onChange={handleInputChange}
              />
              <Input
                name="emergencyContact.phoneNumber"
                type="text"
                placeholder="Phone Number"
                value={formState.emergencyContact.phoneNumber}
                onChange={handleInputChange}
              />
              <Input
                name="emergencyContact.email"
                type="email"
                placeholder="Email"
                value={formState.emergencyContact.email}
                onChange={handleInputChange}
              />
              <Input
                name="emergencyContact.address"
                type="text"
                placeholder="Address"
                value={formState.emergencyContact.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="grid gap-5 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Input
              name="height"
              type="number"
              placeholder="Height (cm)"
              value={formState.healthFitness.height}
              onChange={handleInputChange}
            />
            <Input
              name="weight"
              type="number"
              placeholder="Weight (kg)"
              value={formState.healthFitness.weight}
              onChange={handleInputChange}
            />
            <Select
              name="medicalConditions"
              placeholder="Medical Conditions"
              value={formState.healthFitness.medicalConditions}
              onValueChange={value => handleSelectChange('medicalConditions', value)}
              options={[
                { value: 'normal', label: 'Normal' },
                { value: 'abnormal', label: 'Abnormal' },
              ]}
            />
            <Select
              name="allergies"
              placeholder="Allergies"
              value={formState.healthFitness.allergies}
              onValueChange={value => handleSelectChange('allergies', value)}
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
            />
            <Select
              name="injuries"
              placeholder="Injuries"
              value={formState.healthFitness.injuries}
              onValueChange={value => handleSelectChange('injuries', value)}
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
            />
            <Select
              name="currentFitnessLevel"
              placeholder="Current Fitness Level"
              value={formState.healthFitness.currentFitnessLevel}
              onValueChange={value => handleSelectChange('currentFitnessLevel', value)}
              options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ]}
            />
          </div>
        );
      case 2:
        return (
          <div className="grid gap-5 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Select
              name="fitnessGoals"
              value={formState.goalsPreferences.fitnessGoals}
              onValueChange={value => handleSelectChange('fitnessGoals', value)}
              placeholder="Select Fitness Goals"
              options={[
                { value: 'Weight Loss', label: 'Weight Loss' },
                { value: 'Fat Loss', label: 'Fat Loss' },
                { value: 'Muscle Gain', label: 'Muscle Gain' },
                { value: 'Improved Flexibility', label: 'Improved Flexibility' },
                { value: 'Increased Endurance', label: 'Increased Endurance' },
              ]}
            />

            <Select
              name="dayPreference"
              value={formState.goalsPreferences.dayPreference}
              onValueChange={value => handleSelectChange('dayPreference', value)}
              placeholder="Select Day Preference"
              options={Object.entries(DayPreferenceDisplay).map(([value, label]) => ({
                value,
                label,
              }))}
            />

            <Input
              name="timePreference"
              placeholder="Time Preference"
              type="time"
              value={formState.goalsPreferences.timePreference}
              onChange={handleInputChange}
            />
            <Select
              name="instructorPreference"
              placeholder="Instructor Preference"
              value={formState.goalsPreferences.instructorPreference}
              onValueChange={value => handleSelectChange('instructorPreference', value)}
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
            />
            <Select
              name="additionalService"
              value={formState.goalsPreferences.additionalService}
              onValueChange={value => handleSelectChange('additionalService', value)}
              placeholder="Select Additional Service"
              options={Object.entries(AdditionalServiceDisplay).map(([value, label]) => ({
                value,
                label,
              }))}
            />

            <Input
              name="otherService"
              type="text"
              placeholder="Other Service"
              value={formState.goalsPreferences.otherService}
              onChange={handleInputChange}
            />
            <Select
              name="fitnessAssessment"
              placeholder="Fitness Assessment"
              value={formState.goalsPreferences.fitnessAssessment}
              onValueChange={value => handleSelectChange('fitnessAssessment', value)}
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
            />
          </div>
        );
      case 3:
        return (
          <div className="grid gap-5 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <DropdownMenuRoot>
              <DropdownMenuTrigger asChild>
                <Button>{formState.membership || 'Select Membership'}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onSelect={() =>
                    setFormState(prevState => ({ ...prevState, membership: 'Basic' }))
                  }
                >
                  Basic
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() =>
                    setFormState(prevState => ({ ...prevState, membership: 'Premium' }))
                  }
                >
                  Premium
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setFormState(prevState => ({ ...prevState, membership: 'VIP' }))}
                >
                  VIP
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuRoot>
          </div>
        );
      case 4:
        return (
          <div className="grid gap-5 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Select
              name="paymentStatus"
              value={formState.paymentStatus}
              onValueChange={value => handleSelectChange('paymentStatus', value)}
              placeholder="Select Payment Status"
              options={[
                { value: 'Paid', label: 'Paid' },
                { value: 'Unpaid', label: 'Unpaid' },
              ]}
            />

            <Select
              name="paymentMode"
              value={formState.paymentMode}
              onValueChange={value => handleSelectChange('paymentMode', value)}
              placeholder="Select Payment Mode"
              options={[
                { value: 'UPI', label: 'UPI' },
                { value: 'Card', label: 'Card' },
                { value: 'Cash', label: 'Cash' },
              ]}
            />

            <Select
              name="cycle"
              value={formState.cycle}
              onValueChange={value => handleSelectChange('cycle', value)}
              placeholder="Select Cycle"
              options={[
                { value: 'Monthly', label: 'Monthly' },
                { value: 'Quarterly', label: 'Quarterly' },
                { value: 'Yearly', label: 'Yearly' },
              ]}
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Consent and Agreements:</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Consent to Collect and Use Data for Health and Fitness Purposes</li>
              <li>Consent to contact via WhatsApp for communication</li>
              <li>Consent to Receive Promotional Communication</li>
            </ul>
            <div className="flex items-center">
              <Checkbox name="terms" className="mr-2" />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              <Label htmlFor="signature" className="mt-2">
                E-Signature
              </Label>
              <Input name="signature" type="text" placeholder="Enter your e-signature" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="flex w-full flex-col gap-4">
      <RadioGroupRoot
        className="mb-2 flex"
        value={orientation}
        onValueChange={value => setOrientation(value as StepperProps['orientation'])}
      >
        <Label
          htmlFor="horizontal"
          className="flex w-fit flex-col gap-3 rounded-md border bg-background px-2 py-1 hover:bg-gray-50 [&:has([data-state=checked])]:border-primary"
        >
          <RadioGroupRootItem value="horizontal" id="horizontal" className="sr-only" />
          <h2 className="font-medium">Horizontal</h2>
        </Label>
        <Label
          htmlFor="vertical"
          className="flex w-fit flex-col gap-3 rounded-md border bg-background px-2 py-1 hover:bg-gray-50 [&:has([data-state=checked])]:border-primary"
        >
          <RadioGroupRootItem value="vertical" id="vertical" className="sr-only" />
          <h2 className="font-medium">Vertical</h2>
        </Label>
      </RadioGroupRoot>
      <Stepper orientation={orientation} initialStep={0} steps={steps}>
        {steps.map((stepProps, index) => (
          <Step key={stepProps.label} {...stepProps}>
            <div className="my-4 flex h-auto items-center justify-center rounded-md border bg-secondary p-5 text-primary">
              {renderStepContent(index)}
            </div>
          </Step>
        ))}
        <Footer />
      </Stepper>
    </div>
  );
};

export default AddClientForm;
