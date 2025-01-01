type Props = { url: string };

const ResetPassword = ({ url }: Props) => {
  return (
    <div>
      <h4>Reset password</h4>
      <a href={url}>Click here to reset your password</a>
    </div>
  );
};

export default ResetPassword;
