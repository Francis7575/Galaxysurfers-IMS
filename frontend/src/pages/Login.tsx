import { ChangeEvent, FormEvent, FocusEvent, useState } from 'react'
import { LoginForm } from '../types/types'
import LoginImage from '/assets/login-image.png'
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState<LoginForm>({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState<LoginForm>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const InputFields = [
    { type: 'text', name: 'username', id: 'username', label: 'Username' },
    { type: 'password', name: 'password', id: 'password', label: 'Password' }
  ]

  const formValidation = () => {
    const { username, password } = formData;
    const newErrors: LoginForm = {};
    if (!username) {
      newErrors.username = 'Username cannot be empty';
    }
    if (!password) {
      newErrors.password = 'Password cannot be empty';
    } else if (password.length < 6) {
      newErrors.password = 'Please Enter at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValidation()) {
      setIsLoading(true); // Set loading to true when submitting
      try {
        const success = await handleLogin(formData);
        if (success) {
          navigate('/home');
        }
      } catch (error) {
        console.error('Login error:', error); // Log the error for debugging
        alert('An error occurred during login. Please try again.'); // Show a friendly error message to the user
      } finally {
        setIsLoading(false); // Reset loading after login attempt (successful or not)
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      delete newErrors[name as keyof LoginForm];
      return newErrors;
    });
  };

  return (
    <main className='bg-lightblue font-manrope min-h-[100vh] flex flex-col items-center justify-center lg:justify-betweeen lg:flex-row'>
      <section className='lg:flex lg:w-full lg:justify-between'>
        <div className='max-w-[282px] lg:flex lg:flex-col lg:items-center lg:justify-center lg:w-full lg:mx-auto'>
          <h1 className='text-[3rem] tracking-[-4.32px] text-center mb-[22px]'>
            Login and start management
          </h1>
          <form onSubmit={handleSubmit} className='lg:w-full'>
            {InputFields.map((field, idx) => (
              <div className={`flex flex-col relative ${idx === 0 && 'mb-[30px]'}`}
                key={idx}>
                <label htmlFor={field.id} className='text-blue mb-[8px] text-[1.5rem]'>
                  {field.label}
                </label>
                <input className='border border-blue outline-none pl-4 bg-second-lightblue py-[7px] lg:w-full'
                  onFocus={handleInputFocus}
                  onChange={handleInputChange}
                  type={field.type} id={field.id} name={field.name} />
                <p className='text-red mt-2 font-medium absolute bottom-[-28px]'>{errors[field.name as keyof LoginForm]}</p>
              </div>
            ))}
            <button type="submit"
              disabled={isLoading}
              className={`text-lightblue bg-blue w-full mt-[50px] text-center py-[15px] rounded-[14px] text-[1.5rem] font-medium tracking-[-2.16px] hover:opacity-70 ${isLoading ? 'opacity-50' : ''}`}>
              {isLoading ? 'Loading...' : 'Login'}
            </button>
          </form>
        </div>
        <div className='hidden lg:block'>
          <img src={LoginImage} alt="" className='lg:w-[500px] xl:w-full' />
        </div>
      </section>
    </main>
  )
}

export default Login