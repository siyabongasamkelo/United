import { AuthLayout } from "../components/AuthLayout";
import { RegisterForm } from "../components/RegisterForm";

const Register = () => {
  return (
    <div>
      <AuthLayout>
        <RegisterForm />
      </AuthLayout>
    </div>
  );
};

export default Register;
