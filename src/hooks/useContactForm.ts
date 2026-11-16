'use client';

import { useState } from 'react';
import axios from 'axios';

import { CONTACT_ENDPOINT } from '@/lib/constants';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

export interface ContactFormStatus {
  success: boolean;
  message?: string;
}

interface ContactResponse {
  message?: string;
  error?: string;
}

export interface UseContactFormResult {
  formData: ContactFormData;
  errors: ContactFormErrors;
  status: ContactFormStatus | undefined;
  isProcessing: boolean;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const EMPTY_FORM: ContactFormData = { name: '', email: '', message: '' };
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

/**
 * Contact form state and submission. The request (axios, payload shape, endpoint) deliberately matches
 * the previous site byte for byte: the shared host's mod_security is sensitive to how this POST looks.
 */
export function useContactForm(): UseContactFormResult {
  const [formData, setFormData] = useState<ContactFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<ContactFormStatus | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);

  const validate = (): boolean => {
    const newErrors: ContactFormErrors = {};
    setStatus(undefined);

    if (!formData.name) newErrors.name = 'Name is required.';

    if (!formData.email) newErrors.email = 'Email is required.';
    else if (!EMAIL_PATTERN.test(formData.email)) newErrors.email = 'Please enter a valid email address.';

    if (!formData.message) newErrors.message = 'Message is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    if (!validate()) return;

    setIsProcessing(true);
    const { name, email, message } = formData;
    const data = {
      email,
      subject: 'Personal Site Contact Form from: ' + name,
      message: 'Message from: ' + name + ', email: ' + email + '\n\nMessage:\n' + message,
    };

    try {
      const response = await axios.post<ContactResponse>(CONTACT_ENDPOINT, data);
      setStatus({ success: response.status === 200, message: response.data.message || response.data.error });
      setFormData(EMPTY_FORM);
    } catch (error) {
      setStatus({ success: false, message: 'Error sending email. Please try again.' });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  };

  return { formData, errors, status, isProcessing, handleSubmit, handleChange };
}
