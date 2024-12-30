interface VerifyEmailProps {
  verificationUrl: string;
}

export const VerifyEmail: React.FC<Readonly<VerifyEmailProps>> = ({
  verificationUrl,
}) => (
  <div>
    <h4>Welcome, please click the link below to verify your account</h4>
    <a href={verificationUrl}>Verify</a>
  </div>
);
