import { WarehouseType } from '../../types/typesBackend';

interface FiltersProps {
  warehouses: WarehouseType[];
  activeFilter: string | null;
  onFilterChange: (filterName: string) => void;
}

const Filters = ({ warehouses, activeFilter, onFilterChange }: FiltersProps) => {

  return (
    <section className='px-[34px] mt-[27px] 930:mt-0 md:mx-auto max-w-[750px] md:px-0 930:pl-[34px] 930:mx-0 930:flex-1 930:max-w-[280px]'>
      <div className="bg-sixth-lightblue 930:rounded-[15px] px-[25px] py-4 md:px-[40px] md:py-8 930:max-w-[250px] 930:w-full 930:px-4 930:py-4">
        <div className="bg-white px-4 py-[18px] 930:rounded-[5px]">
          <h2 className='font-medium mb-2'>
            Warehouses
          </h2>
          {warehouses.length === 0 &&(
            <p className='text-center text-gray'>
              No warehouses listed
            </p>
          )}
          <div className={`grid ${warehouses.length === 0 ? '' : 'grid-cols-2'}  gap-[12px] rounded-[8px]`}>
            {warehouses.map((i) => (
              <div key={i.name_warehouse}>
                <button onClick={() => onFilterChange(i.name_warehouse)}
                        className={`py-2 w-full border text-center rounded-[8px] 
                ${warehouses.length === 0 ? 'border-none' : 'border-second-lightgray'}
                ${activeFilter === i.name_warehouse && warehouses.length > 0 ? 'bg-active-lightblue' : ''}`}
                >
                  {warehouses.length === 0 ? 'No warehouses listed' : `${i.name_warehouse}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Filters;
