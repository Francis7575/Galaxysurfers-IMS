import { useState, ChangeEvent, useEffect } from 'react';
import { UserType } from '../../../types/typesBackend';

interface Props {
  user: UserType;
}

interface SubMenuItem {
  idmm2: number;
  idmm_mm2: number;
  name_mm2: string;
  link_mm2: string;
  order_mm2: number;
  access_menu: number;
}


const CheckboxList = ({ user }: Props) => {
  const [checkboxes, setCheckboxes] = useState<SubMenuItem[]>([]);

  const checkMenu = async (event: ChangeEvent<HTMLInputElement>, subMenuId: number) => {
    const isChecked = event.target.checked;

    setCheckboxes((prevMenuList) =>
      prevMenuList.map((menuItem) =>
        menuItem.idmm2 === subMenuId
          ? { ...menuItem, access_menu: isChecked ? 1 : 0 }
          : menuItem
      )
    );

    const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/users/update-menu-access/${user.iduser}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idmm2: subMenuId,
        access: isChecked ? 1 : 0,
      })
    });

    if (response.ok) {
      console.log('ok')
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/users/get-access-menus?userId=${user.iduser}`);
      const data = await response.json();

      const submenus = data.map((item: any) => {
        return item.subMenus;
      })

      setCheckboxes(submenus[0]);
    }
    fetchItems();
  }, [user.iduser]);

  console.log(checkboxes)

  return (
    <section className='max-w-[680px] mx-auto 930:mx-0 930:pl-[29px] 930:max-w-[250px] mb-[60px] 930:mb-[50px]'>
      <div className='grid grid-cols-dynamic px-[40px] 930:px-0 gap-x-8 gap-y-3'>
        {checkboxes.map((field) => (
          <div key={field.idmm2} className='flex items-center gap-[10px]'>
            <input
              type="checkbox"
              id={field.idmm2 + ''}
              name={field.name_mm2}
              checked={field.access_menu === 1}
              onChange={(event) => { checkMenu(event, field.idmm2) }}
            />
            <label htmlFor={field.idmm2 + ''} className='text-[.85rem] text-grayish-gray'>
              {field.name_mm2}
            </label>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CheckboxList;
