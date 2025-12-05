import * as React from 'react';

interface EmailTemplateProps {
  fullName: string;
  company: string;
  email: string;
  message: string;
}

export function EmailTemplate({ fullName, company, email, message }: EmailTemplateProps) {
  return (
    <div>
      <p>Hi, its {fullName} from {company}.</p>
      <p>{message}</p>
      <p>Thank you for your time. You can reach me at {email}.</p>
    </div>
  );
}