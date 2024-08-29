import { ChangeEvent, FormEvent, useState, FocusEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heading } from '../index'
import BackBtn from '/assets/back-button.svg'
import { CreateWarehouseErrors, CreateWarehouseData } from '../../types/types'
import { toast } from 'react-toastify';

const CreateWarehouse = () => {
  const navigate = useNavigate();

  const navToNewWarehouse = () => {
    navigate('/addwarehouse');
  }

  const [formData, setFormData] = useState({
    code: '',
    name: '',
  })
  const [errors, setErrors] = useState<CreateWarehouseErrors>({});

  const InputFields = [
    { type: 'text', name: 'code', id: 'code', label: 'Code' },
    { type: 'text', name: 'name', id: 'name', label: 'Name' },
  ]

  const formValidation = () => {
    const { code, name } = formData;
    const newErrors: CreateWarehouseErrors = {};

    if (!code) {
      newErrors.code = 'Code cannot be empty';
    }

    if (!name) {
      newErrors.name = 'Name Code cannot be empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

    if (!formResult) {
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/warehouses/warehouse-new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code_warehouse: formData.code,
        name_warehouse: formData.name,
      })
    });

    if (response.ok) {
      navigate('/addwarehouse');
      toast.success('Warehouse Created!');
    } else {
      toast.error('Something went wrong!');
    }
  }

  const handleInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      delete newErrors[name as keyof CreateWarehouseErrors];
      return newErrors;
    });
  };

  return (
    <div className='pb-[40px] 930:flex-1 font-manrope'>
      <div className='hidden 930:block'>
        <button onClick={navToNewWarehouse}><Heading title="Warehouse Configuration" /></button>
      </div>
      <div className="px-[40px] 930:px-0 mb-[27px] 930:mb-[34px]">
        <div className="pt-[25px] 930:text-left border-b border-lightgray pb-[17px]
          930:pl-[29px] 930:py-[30px] 930:w-full 930:border-none 930:pb-0 flex items-center">
          <button className='930:hidden max-w-[18px]'>
            <img src={BackBtn} alt="Back button" />
          </button>
          <div className="flex-grow flex justify-center 930:justify-start text-[1.15rem]">
            <h2 className="font-medium">
              Create New Warehouse
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
              <input
                className='border border-blue-500 rounded-[7px] py-[10px] pl-[10px] outline-none'
                value={formData[field.name as keyof CreateWarehouseData]}
                onFocus={handleInputFocus}
                onChange={handleInputChange}
                id={field.id}
                type={field.type}
                name={field.name}
              />
              <p className='text-red text-[.85rem]'>
                {errors[field.name as keyof CreateWarehouseErrors]}
              </p>
            </div>
          ))}
        </div>
        <button type="submit" className='hover:opacity-70 bg-second-blue py-[8px] max-w-[232px] w-full text-white font-medium rounded-[.625rem]'>
          Create Warehouse
        </button>
      </form>
    </div>
  )
}

export default CreateWarehouse