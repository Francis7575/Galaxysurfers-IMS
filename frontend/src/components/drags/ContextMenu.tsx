import { X, Trash } from "lucide-react";
import { useState } from "react";
import DeleteModal from "../common/DeleteModal";

interface ContextMenuProps {
  position: { x: number; y: number };
  name: string;
  onNameChange: (name: string) => void;
  onDelete: () => void;
  onClose: () => void;
}

const ContextMenu = ({
  position,
  name,
  onNameChange,
  onDelete,
  onClose,
}: ContextMenuProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        backgroundColor: "white",
        border: "1px solid black",
        padding: "10px",
        zIndex: 1000,
        display: "flex", // Arrange items in a row
        gap: "10px", // Add gap between items
        alignItems: "center", // Vertically center items
      }}
    >
      <label className="flex items-center">
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="ml-2 p-1 border rounded-md"
        />
      </label>

      <button
        onClick={handleOpenModal}
        className="hover:opacity-70 w-8 h-8 flex items-center justify-center bg-red text-white rounded-md"
      >
        <Trash className="w-4 h-4" />
      </button>
      {isModalOpen && (
        <DeleteModal
          setIsModalOpen={setIsModalOpen}
          itemName={name}
          deleteName={onDelete}
          cancelDelete={cancelDelete}
        />
      )}
      <button
        onClick={onClose}
        className="hover:opacity-70 w-8 h-8 flex items-center justify-center bg-yellow-500 text-white rounded-md"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ContextMenu;
