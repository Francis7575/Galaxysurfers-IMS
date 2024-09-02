import { useState, ChangeEvent, useEffect } from 'react';
import { WarehouseType } from '../../types/typesBackend';

const Filters = () => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string | null }>({});
  const [warehouses, setWarehouseList] = useState<WarehouseType[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/warehouses/warehouses-list`);
      const data = await response.json();

      setWarehouseList(data);
    }
    fetchItems();
  }, []);

  const filters = [
    { name: "Sort By", type: "select", options: ["Ascending", "Descending"] },
    { name: "Group By", type: "select", options: ["Item", "Warehouse", "Location"] },
    { name: "Warehouses", options: warehouses.map(i => i.name_warehouse) }
  ];

  const visibleFilters = showMore ? filters : filters.slice(0, 3); // Show only first 3 filters by default

  const handleButtonClick = (filterName: string) => {
    setActiveFilter(prevFilter => prevFilter === filterName ? null : filterName); // Toggle content visibility
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>, filterName: string) => {
    setSelectedOptions(prevState => ({
      ...prevState,
      [filterName]: event.target.value
    }));
  };

  // const handleDateChange = (event: ChangeEvent<HTMLInputElement>, dateType: string) => {
  //   setSelectedOptions(prevState => ({
  //     ...prevState,
  //     [dateType]: event.target.value
  //   }));
  // };

  return (
    <section className=' px-[34px] mt-[27px] 930:mt-[19px] md:mx-auto max-w-[750px] md:px-0 930:pl-[34px] 930:mx-0'>
      <div className="bg-fifth-lightblue 930:rounded-[15px] px-[25px] py-4 md:px-[40px] md:py-8 930:max-w-[270px] 930:w-full 930:px-[9px] 930:py-4">
        <div className="bg-white px-4 py-[18px] 930:hidden">
          <div className="flex flex-col gap-[12px] rounded-[8px]">
            {visibleFilters.map((filter) => (
              <div key={filter.name} className=''>
                <button
                  onClick={() => handleButtonClick(filter.name)}
                  className={`py-2 w-full border text-left border-second-lightgray px-4 rounded-[8px] ${activeFilter === filter.name ? 'bg-active-lightblue' : ''}`}
                >
                  {filter.name}
                </button>
                <div className={`filter-content ${activeFilter === filter.name ? 'open' : ''}`}>
                  <div className="mt-2 px-4 py-2 max-w-[400px] mx-auto">
                    {filter.type === "select" && (
                      <select
                        className="w-full outline-none p-2 border rounded bg-white text-black border-fourth-lightgray"
                        value={selectedOptions[filter.name] || ''}
                        onChange={(e) => handleSelectChange(e, filter.name)}
                      >
                        {filter.options?.map((option, index) => (
                          <option key={index} value={option} className='text-xs'>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  {Array.isArray(filter.options) && !filter.type && (
                    <div className='grid grid-cols-2 gap-x-[5px] gap-y-[7px]'>
                      {filter.options.map((item, index) => (
                        <div key={index} className='border border-third-lightgray rounded-[8px] py-[2px]'>
                          <button>
                            {item}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {filters.length > 3 && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="mt-4 930:hidden py-2 px-4 rounded-[8px] text-center"
          >
            {showMore ? 'Show Less Filters' : 'Show More Filters'}
          </button>
        )}

        {/* Desktop */}
        <section className='hidden 930:block'>
          <div className='flex flex-col-reverse gap-[13px]'>
            {filters.map((filter, idx) => (
              <div key={idx} className='bg-white w-full rounded-[8px] pt-[4px] px-[8px] pb-3'>
                <h2 className='font-medium'>
                  {filter.name}
                </h2>
                <div className="mt-2 py-2">
                  {filter.type === "select" && (
                    <select
                      className="w-full p-2 outline-none border rounded bg-white text-black border-fourth-lightgray"
                      value={selectedOptions[filter.name] || ''}
                      onChange={(e) => handleSelectChange(e, filter.name)}
                    >
                      {filter.options?.map((option, index) => (
                        <option key={index} value={option} className='text-xs'>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                  {Array.isArray(filter.options) && !filter.type && (
                    <div className='grid grid-cols-2 gap-x-[5px] gap-y-[7px]'>
                      {filter.options.map((item, index) => (
                        <div key={index} >
                          <button className='border border-third-lightgray rounded-[8px] px-3'>
                            {item}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default Filters;
