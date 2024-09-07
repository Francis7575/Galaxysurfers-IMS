import { ChangeEvent, FormEvent, useState, FocusEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heading } from '../index'
import { toast } from 'react-toastify';
import { InventoryData } from '../../types/types';
import { ItemType, LocationsType, WarehouseType } from '../../types/typesBackend';

type InventoryInErrors = {
  [K in keyof InventoryData]?: string;
} & {
  submit?: string;
}

const InventoryIn = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ItemType[]>([]);
  const [warehouses, setWh] = useState<WarehouseType[]>([]);
  const [locations, setLocations] = useState<LocationsType[]>([]);
  const [showBatchAndExpiration, setShowBatchAndExpiration] = useState(false);

  const navToInventoryMain = () => {
    navigate('/inventoryMain');
  }

  const [formData, setFormData] = useState<InventoryData>({
    product: '',
    quantity: '',
    units: '',
    warehouse: '',
    location: '',
    batch: '',
    expire_date: ''
  })
  const [errors, setErrors] = useState<InventoryInErrors>({});

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/items/items-list`);
      const data = await response.json();

      setItems(data);
    }

    fetchItems();

    const fetchWh = async () => {
      const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/warehouses/warehouses-list`);
      const data = await response.json();

      setWh(data)
    }

    fetchWh();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/warehouses/get-locations/${formData.warehouse}`);
      const data = await response.json();

      setLocations(data);
    }

    fetchItems();

  }, [formData.warehouse])

  const InputFields = [
    { type: 'select', name: 'product' as const, id: 'product', label: 'Product', options: items.map(i => i.name_item), values: items.map(i => i.iditem) },
    { type: 'text', name: 'units' as const, id: 'units', label: 'Units', disabled: true },
    { type: 'number', name: 'quantity' as const, id: 'quantity', label: 'Quantity' },
    { type: 'select', name: 'warehouse' as const, id: 'warehouse', label: 'Warehouse', options: warehouses.map(i => i.name_warehouse), values: warehouses.map(i => i.idwarehouse) },
    { type: 'select', name: 'location' as const, id: 'location', label: 'Location', options: locations.map(i => i.name_loc), values: locations.map(i => i.idloc) },
    ...(showBatchAndExpiration ? [
      { type: 'text', name: 'batch' as const, id: 'batch', label: 'Batch' },
      { type: 'date', name: 'expire_date' as const, id: 'expire_date', label: 'Expire Date', className: 'w-full sm:w-[200px]' }
    ] : [])
  ];

  const formValidation = (): boolean => {
    const newErrors: InventoryInErrors = {};

    if (!formData.product.trim()) {
      newErrors.product = 'Product cannot be empty';
    }

    if (!formData.quantity || isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }

    if (!formData.warehouse.trim()) {
      newErrors.warehouse = 'Warehouse cannot be empty';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location cannot be empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'product') {
      const index = items.findIndex(i => i.iditem === parseInt(value));

      setFormData(prevState => ({
        ...prevState,
        units: items[index].idunit_item
      }));

      if (items[index].batch_ctrl_item == 1) {
        setShowBatchAndExpiration(true);
      } else {
        setShowBatchAndExpiration(false);
      }
    }

    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formValidation()) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/inventory/inventory-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Inventory Added');
        navigate('/inventoryMain');
      } else {
        toast.error('Something went wrong!');
        const errorData = await response.json();
        console.error('Error submitting inventory:', errorData);
        setErrors(prev => ({ ...prev, submit: 'Failed to submit inventory. Please try again.' }));
      }
    } catch (error) {
      toast.error('Something went wrong!');
      console.error('Error submitting inventory:', error);
      setErrors(prev => ({ ...prev, submit: 'Network error. Please check your connection and try again.' }));
    }
  }

  const handleInputFocus = (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      delete newErrors[name as keyof InventoryInErrors];
      return newErrors;
    });
  };

  return (
    <div className='flex flex-col'>
      <div className="font-manrope flex-1 w-full">
        <a className="w-full" onClick={navToInventoryMain}><Heading title="Inventory In" /></a>
        <div className="mt-8 930:mt-12">
          <form onSubmit={handleSubmit} className='max-w-[300px] w-full md:max-w-[500px] 930:max-w-none mx-auto 930:mx-0 930:px-[29px]'>
            <div className='flex flex-col gap-4 930:flex-row 930:flex-wrap'>
              {InputFields.map((field) => (
                <div key={field.id} className='flex flex-col gap-4 930:flex-grow'>
                  <label htmlFor={field.id} className='text-grayish-gray'>
                    {field.label}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      className={`border border-blue-500 rounded-[7px] py-[10px] px-[10px] outline-none ${field.className || ''} ${field.disabled ? 'disabled-input' : ''}`}
                      value={formData[field.name]}
                      onFocus={handleInputFocus}
                      onChange={handleInputChange}
                      id={field.id}
                      name={field.name}
                      disabled={field.disabled || false}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map((option, index) => (
                        <option key={index} value={field.values[index]} label={option} />
                      ))}

                    </select>
                  ) : (
                    <input
                      className={`border border-blue-500 rounded-[7px] py-[10px] pl-[10px] outline-none ${field.className || ''} ${field.disabled ? 'disabled-input' : ''}`}
                      value={formData[field.name]}
                      onFocus={handleInputFocus}
                      onChange={handleInputChange}
                      id={field.id}
                      type={field.type}
                      name={field.name}
                      disabled={field.disabled || false}
                    />
                  )}
                  {errors[field.name] && (
                    <p className='text-red-500 text-[.85rem]'>
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {errors.submit && (
              <p className='text-red-500 text-center mt-4'>{errors.submit}</p>
            )}
            <div className='flex justify-center 930:justify-start mt-4 930:mt-[47px]'>
              <button type="submit" className='hover:opacity-70 bg-second-blue py-[8px] max-w-[232px] w-full text-white font-medium rounded-[.625rem]'>
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default InventoryIn