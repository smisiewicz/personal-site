'use client';

import { useContactForm, type ContactFormData } from '@/hooks/useContactForm';
import Spinner from '@/components/ui/Spinner';

import PanelShell from './PanelShell';

const INPUT_CLASS =
  'w-full border bg-hive-bg/70 p-3 text-hive-ice placeholder-hive-muted transition-colors duration-300 focus:outline-none';

interface FieldErrorProps {
  id: string;
  message: string | undefined;
}

function FieldError({ id, message }: FieldErrorProps): React.JSX.Element {
  return (
    <p
      id={id}
      role="alert"
      className={`overflow-hidden px-2 text-sm text-hive-error transition-all duration-300 ${
        message ? 'h-8 pt-1 opacity-100' : 'h-2 opacity-0'
      }`}
    >
      {message}
    </p>
  );
}

export default function ContactPanel(): React.JSX.Element {
  const { formData, errors, status, isProcessing, handleSubmit, handleChange } = useContactForm();

  const fieldProps = (name: keyof ContactFormData, label: string): React.InputHTMLAttributes<HTMLInputElement> => ({
    name,
    value: formData[name],
    placeholder: label,
    'aria-label': label,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': `contact-${name}-error`,
    className: `${INPUT_CLASS} ${
      errors[name] ? 'border-hive-error/70 focus:border-hive-error' : 'border-hive-line focus:border-hive-ice'
    }`,
  });

  return (
    <PanelShell code="04 // OPEN CHANNEL" title="Get in Touch">
      <p className="mb-7 font-light">
        <span className="md:hidden">Feel free to reach out via the contact form below.</span>
        <span className="max-md:hidden">
          Feel free to reach out via the contact form below, or scan a QR code to send it from a mobile device.
        </span>
      </p>

      <div className="flex w-full gap-9">
        <form className="w-full" onSubmit={(event) => void handleSubmit(event)} noValidate>
          {status?.message && (
            <div
              role="status"
              className={`mb-6 w-full border p-4 ${
                status.success
                  ? 'border-hive-success/50 bg-hive-success/10 text-hive-success'
                  : 'border-hive-error/50 bg-hive-error/10 text-hive-error'
              }`}
            >
              {status.message}
            </div>
          )}

          <input type="text" autoComplete="name" onChange={handleChange} {...fieldProps('name', 'Your Name')} />
          <FieldError id="contact-name-error" message={errors.name} />

          <input type="email" autoComplete="email" onChange={handleChange} {...fieldProps('email', 'Your Email')} />
          <FieldError id="contact-email-error" message={errors.email} />

          <textarea
            onChange={handleChange}
            {...(fieldProps('message', 'Your Message') as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            className={`${fieldProps('message', 'Your Message').className} block min-h-40 resize-y`}
          />
          <FieldError id="contact-message-error" message={errors.message} />

          <button
            type="submit"
            disabled={isProcessing}
            className="hive-chip relative mt-2 flex min-h-12 w-full items-center justify-center bg-hive-cyan font-display text-sm font-bold uppercase tracking-[0.25em] text-hive-bg transition-all duration-300 hover:bg-hive-accent hover:shadow-[0_0_28px_rgba(64,214,255,0.7)] disabled:bg-hive-cyan/30 disabled:text-hive-muted"
          >
            <span>Send Message</span>
            {isProcessing && <Spinner className="right-4 h-5 w-5 border-hive-bg/40 border-t-hive-bg" />}
          </button>
        </form>

        <div className="w-px shrink-0 bg-hive-line max-md:hidden" />

        {/* The code encodes: mailto:contact@misiewicz.info?subject=misiewicz.info%20-%20Personal%20Site%20Contact%20Form */}
        <div className="flex w-64 shrink-0 flex-col items-center justify-center max-md:hidden">
          {/* Neon cyan modules on the page's dark navy. The padding keeps a dark quiet zone around the
              code, which inverted codes need even more than regular ones. */}
          <div className="w-full border border-hive-cyan/60 bg-hive-bg p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/images/contact-form-qr.svg"
              alt="QR code that opens an email to Sebastian"
              className="w-full"
            />
          </div>
          <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-hive-muted">
            Scan to email from mobile
          </p>
        </div>
      </div>
    </PanelShell>
  );
}
