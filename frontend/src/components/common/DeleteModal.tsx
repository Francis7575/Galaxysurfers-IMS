import modalIcon from "/assets/x-icon.png"

type DeleteModalProps = {
  itemName: string
  cancelDelete: () => void;
  deleteUser: () => void;
  setIsModalOpen: (param: boolean) => void
}

const DeleteModal = ({ itemName, cancelDelete, deleteUser, setIsModalOpen }: DeleteModalProps) => {

  const handleOverlayClick = () => {
    setIsModalOpen(false)
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <>
      <div onClick={handleOverlayClick}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div onClick={handleModalClick}
          className="bg-white py-4 px-6 rounded-xl shadow-lg">
          <img src={modalIcon} className="max-w-[40px] mb-4" alt="" />
          <h2 className="text-lg font-semibold">Confirm Deletion</h2>
          <p>Are you sure you want to delete {itemName}?</p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={cancelDelete}
              className="bg-gray-300 hover:bg-gray-400 hover:opacity-50 text-gray-800 font-bold py-2 px-4 rounded"
            >
              No
            </button>
            <button
              onClick={deleteUser}
              className="bg-red-500 hover:bg-red-700 hover:opacity-50 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeleteModal