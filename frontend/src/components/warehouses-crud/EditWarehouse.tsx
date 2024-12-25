import { ChangeEvent, FormEvent, useState, FocusEvent } from 'react'
import { Heading  } from '..'
import BackBtn from '/assets/back-button.svg'
import { EditWarehouseData, EditWarehouseErrors } from '../../types/types'
import { useLocation, useNavigate } from 'react-router-dom'
import { WarehouseType } from '../../types/typesBackend'
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const EditWarehouse = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const warehouse = location.state as WarehouseType;

  const [formData, setFormData] = useState<EditWarehouseData>({
    code: warehouse.code_warehouse,
    name: warehouse.name_warehouse
  })
  const [errors, setErrors] = useState<EditWarehouseErrors>({});

  const InputFields = [
    { type: 'text', name: 'code', id: 'code', label: 'Code' },
    { type: 'text', name: 'name', id: 'name', label: 'Name' },
  ]

  const formValidation = () => {
    const { code, name } = formData;
    const newErrors: EditWarehouseErrors = {};

    if (!code) {
      newErrors.code = 'Code name cannot be empty';
    }

    if (!name) {
      newErrors.name = 'Name cannot be empty';
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
        
    if(!formResult){
        return;
    }

    const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/warehouses/warehouse-update/${warehouse.idwarehouse}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code_warehouse: formData.code, 
            name_warehouse: formData.name, 
        })
    });

    if(response.ok){
        navigate('/warehouseMain');
        toast.success('Warehouse Updated!');
    }else{
        
        toast.error('Something went wrong!');
    }
  }

  const handleInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      delete newErrors[name as keyof EditWarehouseErrors];
      return newErrors;
    });
  };

  return (
    <div className='pb-[40px] 930:flex-1 font-manrope'>
      <div className='hidden 930:block'>
        <Link to="/warehouseMain"><Heading title="Warehouse Configuration" /></Link>
      </div>
      <div className="px-[40px] 930:px-0 mb-[27px] 930:mb-[34px]">
        <div className="pt-[25px] 930:text-left border-b border-lightgray pb-[17px]
          930:pl-[29px] 930:py-[30px] 930:w-full 930:border-none 930:pb-0 flex items-center">
          <Link to="/warehouseMain" className='930:hidden max-w-[18px]'>
            <img src={BackBtn} alt="Back button" />
          </Link>
          <div className="flex-grow flex justify-center 930:justify-start text-[1.15rem]">
            <h2 className="font-medium">
              Edit Warehouse
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
                value={formData[field.name as keyof EditWarehouseData]}
                onFocus={handleInputFocus}
                onChange={handleInputChange}
                id={field.id}
                type={field.type}
                name={field.name}
              />
              <p className='text-red text-[.85rem]'>
                {errors[field.name as keyof EditWarehouseErrors]}
              </p>
            </div>
          ))}
        </div>
        <div className='flex justify-center 930:justify-start mt-4 930:mt-[47px]'>
          <button type="submit" className='hover:opacity-70 bg-second-blue py-[8px] max-w-[232px] w-full text-white font-medium rounded-[.625rem]'>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditWarehouse
