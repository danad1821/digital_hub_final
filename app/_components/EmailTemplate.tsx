import * as React from 'react';

interface EmailTemplateProps {
  fullName: string;
  phone: string;
  email: string;
  message: string;
}

export function EmailTemplate({ fullName, phone, email, message }: EmailTemplateProps) {
  return (
    <div>
      <h1>{fullName}!</h1>
      <h2>Contact Info:</h2>
      <div>
        <p>{email}</p>
        <p>{phone}</p>
      </div>
      <h2>Message:</h2>
      <p>{message}</p>
    </div>
  );
}