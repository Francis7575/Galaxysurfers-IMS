import { X, Trash } from "lucide-react";

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

    return (
        <div
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                backgroundColor: 'white',
                border: '1px solid black',
                padding: '10px',
                zIndex: 1000,
                display: 'flex', // Arrange items in a row
                gap: '10px', // Add gap between items
                alignItems: 'center' // Vertically center items
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
            <button onClick={onDelete} className="hover:opacity-70 w-8 h-8 flex items-center justify-center bg-red text-white rounded-md">
                <Trash className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="hover:opacity-70 w-8 h-8 flex items-center justify-center bg-yellow-500 text-white rounded-md">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

export default ContextMenu;
