import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "@/components/common/Heading";
import { ItemType } from "../../types/typesBackend";
import { toast } from "react-toastify";
import DeleteModal from "../../components/common/DeleteModal";

const ItemMain = () => {
  const navigate = useNavigate();
  const tableHeading = [
    "Code",
    "Name",
    "Description",
    "Unit",
    "Batch",
    "Expiration",
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemsList, setItemsList] = useState<ItemType[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);

  const navToNewItem = () => {
    navigate("/item/add");
  };

  const navToEditItem = (item: ItemType) => {
    navigate("/editItem", { state: item });
  };

  const deleteItem = async (iditem: number) => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_BACKEND_URL}/items/item-cancel/${iditem}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      toast.success("Item Deleted!");
      const newUsersList = itemsList.filter((item) => item.iditem !== iditem);
      setItemsList(newUsersList);
      setIsModalOpen(false);
    } else {
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_BACKEND_URL}/items/items-list`
      );
      const data = await response.json();
      setItemsList(data);
    };
    fetchItems();
  }, []);

  const cancelDelete = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteClick = (item: ItemType) => {
    setSelectedItem(item); // Set the selected item to be deleted
    setIsModalOpen(true); // Open the modal
  };

  return (
    <div className="font-manrope flex-1 w-full pb-8">
      <Heading showBackBtn={false} title="Item Configuration" />
      <div className="flex justify-center 930:justify-start 930:pl-[29px] mt-[27px] mb-[17px] md:mb-[40px] 930:mt-[29px] 930:mb-[21px]">
        <button
          className=" relative text-white text-center hover:opacity-80 rounded-lg bg-deep-blue py-[10px] max-w-[222px] w-full font-medium"
          onClick={navToNewItem}
        >
          Add New Item
        </button>
      </div>
      <div className="overflow-x-auto px-[20px] 930:px-[29px]">
        <table className="w-full max-w-[600px] mx-auto 930:mx-0">
          <thead>
            <tr className="text-[.85rem]">
              {tableHeading.map((heading, index) => (
                <th
                  key={index}
                  className="border-table text-grayish-gray py-[10px] px-[20px]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className=" cursor-pointer">
            {itemsList.map((item) => (
              <tr
                className="text-[.85rem] bg-second-lightblue hover:bg-second-lightblue-hover"
                key={item.iditem}
              >
                <td className="p-[10px] text-center border-table">
                  {item.code_item}
                </td>
                <td className="p-[10px] text-center border-table">
                  {item.name_item}
                </td>
                <td className="p-[10px] text-center border-table">
                  {item.description_item}
                </td>
                <td className="p-[10px] text-center border-table">
                  {item.idunit_item}
                </td>
                <td className="p-[10px] text-center border-table">
                  {item.batch_ctrl_item == 1 ? "Yes" : "No"}
                </td>
                <td className="p-[10px] text-center border-table">
                  {item.expiration_ctrl_item == 1 ? "Yes" : "No"}
                </td>
                {/* <td className="flex items-center justify-center py-[10px] gap-2">
                  <button
                    onClick={() => {
                      navToEditItem(item);
                    }}
                    className="hover:opacity-70"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 18 17"
                      fill="none"
                    >
                      <rect
                        x="0.5"
                        width="17"
                        height="17"
                        rx="5"
                        fill="#406D42"
                      />
                      <path
                        d="M4.10599 14C3.93667 13.9997 3.77527 13.9283 3.66115 13.8032C3.54492 13.6791 3.48717 13.5113 3.5024 13.3419L3.65028 11.7154L10.4817 4.88449L12.6166 7.01938L5.78699 13.8497L4.16092 13.9976C4.14221 13.9994 4.1235 14 4.10599 14ZM13.0428 6.59252L10.9085 4.45764L12.1887 3.17707C12.3019 3.0637 12.4555 3 12.6157 3C12.7759 3 12.9295 3.0637 13.0428 3.17707L14.323 4.45764C14.4363 4.57088 14.5 4.72455 14.5 4.8848C14.5 5.04504 14.4363 5.19871 14.323 5.31195L13.0434 6.59192L13.0428 6.59252Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteClick(item);
                    }}
                    className="hover:opacity-70"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 18 17"
                      fill="none"
                    >
                      <rect
                        x="0.5"
                        width="17"
                        height="17"
                        rx="5"
                        fill="#FF6F6F"
                      />
                      <path
                        d="M12.0556 14H5.94444C5.26943 14 4.72222 13.5075 4.72222 12.9V5.75H3.5V4.65H5.94444V4.1C5.94444 3.49249 6.49165 3 7.16667 3H10.8333C11.5083 3 12.0556 3.49249 12.0556 4.1V4.65H14.5V5.75H13.2778V12.9C13.2778 13.5075 12.7306 14 12.0556 14ZM5.94444 5.75V12.9H12.0556V5.75H5.94444ZM7.16667 4.1V4.65H10.8333V4.1H7.16667ZM10.8333 11.8H9.61111V6.85H10.8333V11.8ZM8.38889 11.8H7.16667V6.85H8.38889V11.8Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <DeleteModal
          setIsModalOpen={setIsModalOpen}
          itemName={selectedItem!.name_item}
          cancelDelete={cancelDelete}
          deleteName={() => deleteItem(selectedItem!.iditem)}
        />
      )}
    </div>
  );
};

export default ItemMain;
