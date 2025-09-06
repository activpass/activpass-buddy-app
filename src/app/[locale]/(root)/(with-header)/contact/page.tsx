'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { FormFieldItem } from '@paalan/react-ui';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Flex,
  Form,
  Text,
  toast,
} from '@paalan/react-ui';
import { useForm } from 'react-hook-form';
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';
import { BiSupport } from 'react-icons/bi';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';

import { useRouter } from '@/lib/navigation';
import { api } from '@/trpc/client';
import {
  type ContactFormData,
  contactFormSchema,
  getInquiryTypeOptions,
} from '@/validations/contact.validation';

const getContactFormFields = (): FormFieldItem<ContactFormData>[] => [
  {
    type: 'input',
    name: 'name',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true,
    inputProps: { autoFocus: true },
  },
  {
    type: 'input',
    name: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email address',
    required: true,
    inputType: 'email',
  },
  {
    type: 'select',
    name: 'type',
    label: 'Inquiry Type',
    placeholder: 'Select inquiry type',
    required: true,
    options: getInquiryTypeOptions(),
  },
  {
    type: 'input',
    name: 'subject',
    label: 'Subject',
    placeholder: 'Brief description of your inquiry',
    required: true,
  },
  {
    type: 'textarea',
    name: 'message',
    label: 'Message',
    placeholder: 'Please provide details about your inquiry...',
    required: true,
    textareaProps: {
      rows: 5,
    },
  },
];

const ContactPage = () => {
  const router = useRouter();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      type: 'general',
      subject: '',
      message: '',
    },
  });

  const createContactMutation = api.contacts.create.useMutation({
    onSuccess: () => {
      toast.success("Your message has been sent successfully! We'll get back to you soon.");
      form.reset();
      // Redirect to thank you page
      router.push('/contact/thank-you');
    },
    onError: error => {
      toast.error(error.message || 'Failed to send message. Please try again later.');
    },
  });

  const contactMethods = [
    {
      icon: <AiOutlineMail className="size-6 text-blue-600" />,
      title: 'Email Support',
      description: "Send us an email and we'll get back to you within 24 hours",
      contact: 'support@activpass.in',
      action: 'mailto:support@activpass.in',
    },
    {
      icon: <AiOutlinePhone className="size-6 text-green-600" />,
      title: 'Phone Support',
      description: 'Call us during business hours for immediate assistance',
      contact: '+91 (555) 123-4567',
      action: 'tel:+915551234567',
    },
    {
      icon: <FaMapMarkerAlt className="size-6 text-red-600" />,
      title: 'Visit Our Office',
      description: 'Come visit our headquarters for in-person support',
      contact: '123 Business District, Mogappair, Chennai 600037, India',
      action: 'https://maps.google.com/?q=123+Business+District,+Mogappair,+Chennai+600037,+India',
    },
    {
      icon: <BiSupport className="size-6 text-purple-600" />,
      title: 'Live Chat',
      description: 'Get instant help through our live chat support',
      contact: 'Available 9 AM - 6 PM IST',
      action: '#',
    },
  ];

  const onSubmit = async (data: ContactFormData) => {
    createContactMutation.mutate(data);
  };

  const isSubmitting = createContactMutation.isPending;
  const formFields = getContactFormFields();

  return (
    <Box className="min-h-screen bg-background py-12">
      <Box className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Box className="text-center">
          <Text className="text-3xl font-bold tracking-tight text-secondary-foreground sm:text-4xl">
            Contact ActivPass
          </Text>
          <Text className="mt-4 text-lg leading-6 text-muted-foreground">
            We're here to help you get the most out of ActivPass. Reach out to us anytime!
          </Text>
        </Box>

        {/* Contact Methods Grid */}
        <Box className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {contactMethods.map(method => (
            <Card key={method.title} className="text-center">
              <CardContent className="p-6">
                <Box className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-gray-100">
                  {method.icon}
                </Box>
                <CardTitle className="mb-2 text-lg font-medium">{method.title}</CardTitle>
                <Text className="mb-3 text-sm text-muted-foreground">{method.description}</Text>
                <Text className="text-sm font-medium text-secondary-foreground">
                  {method.contact}
                </Text>
                {method.action !== '#' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => window.open(method.action, '_blank')}
                  >
                    Contact Now
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Contact Form and Info */}
        <Box className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form<ContactFormData>
                form={form}
                onSubmit={onSubmit}
                hideResetButton
                fields={formFields}
                submitClassName="w-full"
                isSubmitting={isSubmitting}
                submitText={
                  isSubmitting ? (
                    'Sending Message...'
                  ) : (
                    <Flex className="gap-2">
                      <AiOutlineMail className="size-5" />
                      Send Message
                    </Flex>
                  )
                }
              />
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Box className="space-y-6">
            {/* Office Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HiOutlineOfficeBuilding className="mr-2 size-5" />
                  Office Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Box className="space-y-2">
                  <Box className="flex justify-between">
                    <Text className="text-sm text-muted-foreground">Monday - Friday</Text>
                    <Text className="text-sm font-medium">9:00 AM - 6:00 PM IST</Text>
                  </Box>
                  <Box className="flex justify-between">
                    <Text className="text-sm text-muted-foreground">Saturday</Text>
                    <Text className="text-sm font-medium">10:00 AM - 2:00 PM IST</Text>
                  </Box>
                  <Box className="flex justify-between">
                    <Text className="text-sm text-muted-foreground">Sunday</Text>
                    <Text className="text-sm font-medium">Closed</Text>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Box className="space-y-4">
                  <Box>
                    <Text className="text-sm font-medium">
                      How quickly do you respond to inquiries?
                    </Text>
                    <Text className="mt-1 text-sm text-muted-foreground">
                      We typically respond to all inquiries within 24 hours during business days.
                    </Text>
                  </Box>
                  <Box>
                    <Text className="text-sm font-medium">Do you offer phone support?</Text>
                    <Text className="mt-1 text-sm text-muted-foreground">
                      Yes! Phone support is available during business hours for urgent matters.
                    </Text>
                  </Box>
                  <Box>
                    <Text className="text-sm font-medium">Can I schedule a demo?</Text>
                    <Text className="mt-1 text-sm text-muted-foreground">
                      Absolutely! Contact us to schedule a personalized demo of ActivPass.
                    </Text>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800">Emergency Support</CardTitle>
              </CardHeader>
              <CardContent>
                <Text className="text-sm text-orange-700">
                  For critical system issues affecting your operations, call our emergency line:
                </Text>
                <Text className="mt-2 text-lg font-bold text-orange-800">+91 (555) 999-HELP</Text>
                <Text className="mt-1 text-xs text-orange-600">
                  Available 24/7 for existing customers with active subscriptions
                </Text>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Footer Message */}
        <Box className="mt-16 text-center">
          <Text className="text-muted-foreground">
            We value your feedback and are committed to providing excellent support. Thank you for
            choosing ActivPass!
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactPage;
