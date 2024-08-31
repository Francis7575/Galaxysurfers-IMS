import { ChangeEvent, FormEvent, useState, FocusEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import { CreateUserData, CreateUserErrors } from '../../types/types';
import { z } from 'zod'
import { Heading } from '..';
import BackBtn from '/assets/back-button.svg'
import { toast } from 'react-toastify';

const userSchema = z.string().min(6).max(14);
const nameSchema = z.string().min(2).max(20);

const CreateUser = () => {
    const navigate = useNavigate();

    const navToUserMain = () => {
        navigate('/userMain');
    }

	const [formData, setFormData] = useState<CreateUserData>({
		user: '',
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	})
	const [errors, setErrors] = useState<CreateUserErrors>({});

	const InputFields = [
		{ type: 'text', name: 'user', id: 'user', label: 'User' },
		{ type: 'text', name: 'name', id: 'name', label: 'Name' },
		{ type: 'text', name: 'email', id: 'email', label: 'Mail' },
		{ type: 'password', name: 'password', id: 'password', label: 'Password' },
		{ type: 'password', name: 'confirmPassword', id: 'confirmPassword', label: 'Confirm Password' }
	]

	const formValidation = () => {
		const { user, name, email, password, confirmPassword } = formData;
		const newErrors: CreateUserErrors = {};

		if (!user) {
			newErrors.user = 'User cannot be empty';
		} else {
			const userResult = userSchema.safeParse(user);
			if (!userResult.success) {
				newErrors.user = "User must be between 6 and 14 characters";
			}
		}

		if (!name) {
			newErrors.name = 'Name cannot be empty';
		} else {
			const nameResult = nameSchema.safeParse(name);
			if (!nameResult.success) {
				newErrors.name = "Name must be between 2 and 20 characters";
			}
		}

		if (!validateEmail(email)) {
			newErrors.email = 'Please enter a valid email address';
		}

		if (!password) {
			newErrors.password = 'Password cannot be empty';
		} else if (password.length < 6) {
			newErrors.password = 'Password must be at least 6 characters long';
		}

		if (confirmPassword !== password) {
			newErrors.confirmPassword = 'Passwords do not match';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	const validateEmail = (email: string) => {
		const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return re.test(email);
	}

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prevState => ({
			...prevState,
			[name]: value
		}));
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formResult = formValidation()
        
        if(!formResult){
            return;
        }

        const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/users/user-add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: formData.user,
                name_user: formData.name,
                mail_user: formData.email,
                pass_user: formData.password
            })
        });

        if(response.ok){
            navigate('/userMain');
            toast.success('User Created!');
        }else if(response.status == 401){
            toast.error('User already exists');
        }else{
            toast.error('Something went wrong!');
        }
	}

	const handleInputFocus = (e: FocusEvent<HTMLInputElement>) => {
		const { name } = e.target;
		setErrors(prevErrors => {
			const newErrors = { ...prevErrors };
			delete newErrors[name as keyof CreateUserErrors];
			return newErrors;
		});
	};

	return (
		<div className='pb-[40px] 930:flex-1 font-manrope'>
			<div className='hidden 930:block'>
				<a onClick={navToUserMain}><Heading title="User Configuration" /></a>
			</div>
			<div className="px-[40px] 930:px-0 mb-[27px] 930:mb-[34px]">
				<div className="pt-[25px] 930:text-left border-b border-lightgray pb-[17px]
					930:pl-[29px] 930:py-[30px] 930:w-full 930:border-none 930:pb-0 flex items-center">
					<button className='930:hidden max-w-[18px]'>
						<img src={BackBtn} alt="Back button" />
					</button>
					<div className="flex-grow flex justify-center 930:justify-start text-[1.15rem]">
						<h2 className="font-medium">
							Create New User
						</h2>
					</div>
				</div>
			</div>
			<form onSubmit={handleSubmit} className='max-w-[300px] w-full md:max-w-[500px] 930:max-w-none mx-auto 930:mx-0 930:px-[29px]'>
				<div className='flex flex-col gap-4 930:flex-row 930:flex-wrap'>
					{InputFields.map((field, idx) => (
						<div key={idx} className='flex flex-col gap-4 930:flex-grow'>
							<label htmlFor={field.id} className='text-grayish-gray'>
								{field.label}
							</label>
							<input className='border border-blue-500 rounded-[7px] py-[10px] pl-[10px] outline-none'
								value={formData[field.name as keyof CreateUserData] as string}
								onFocus={handleInputFocus}
								onChange={handleInputChange}
								id={field.id}
								type={field.type}
								name={field.name} />
							<p className='text-red text-[.85rem]'>
								{errors[field.name as keyof CreateUserErrors]}
							</p>
						</div>
					))}
				</div>
				<div className='flex justify-center 930:justify-start mt-4 930:mt-[47px]'>
					<button className='bg-second-blue hover:opacity-70 py-[8px] max-w-[232px] w-full text-white font-medium rounded-[.625rem]'>
						Create User
					</button>
				</div>
			</form>
		</div>
	)
}

export default CreateUser
