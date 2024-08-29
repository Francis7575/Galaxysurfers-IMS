import React, { useState, useEffect } from 'react';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { Edges, OrbitControls, Plane } from '@react-three/drei';
import { useLocation, useNavigate } from 'react-router-dom';
import DraggableBox from './DraggableBox';
import ContextMenu from './ContextMenu';
import { WarehouseType } from '../../types/typesBackend';
import { Heading } from '../';
import BackBtn from '/assets/back-button.svg';

const Threejs: React.FC = () => {
    const location = useLocation();
    const warehouse = location.state as WarehouseType;
    const navigate = useNavigate();

    const navToWarehouseMain = () => {
        navigate('/addwarehouse');
    };

    const [isDragging, setIsDragging] = useState(false);
    const [boxPositions, setBoxPositions] = useState<[number, number, number][]>([]);
    const [boxSizes, setBoxSizes] = useState<[number, number, number][]>([]);
    const [boxColors, setBoxColors] = useState<string[]>([]);
    const [boxNames, setBoxNames] = useState<string[]>([]);

    const [newSize, setNewSize] = useState<[number, number, number]>([1, 1, 1]);
    const [newColor, setNewColor] = useState<string>('gray');

    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);

    const handleDragStart = () => {
        setIsDragging(true);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const updateBoxPosition = (index: number, newPos: [number, number, number]) => {
        setBoxPositions((prev) => {
        const newPositions = [...prev];
        newPositions[index] = newPos;
        return newPositions;
        });
    };

    const handleAddBox = () => {
        setBoxPositions([...boxPositions, [0, newSize[1] / 2 - 0.5, 0]]);
        setBoxSizes([...boxSizes, newSize]);
        setBoxColors([...boxColors, newColor]);
        setBoxNames([...boxNames, '']);
    };

    const handleBoxClick = (index: number, event: ThreeEvent<MouseEvent>) => {
        setSelectedBoxIndex(index);
        setContextMenuPosition({ x: event.clientX, y: event.clientY });
        setContextMenuOpen(true);
    };

    const handleNameChange = (name: string) => {
        if (selectedBoxIndex !== null) {
        setBoxNames((prev) => {
            const newNames = [...prev];
            newNames[selectedBoxIndex] = name;
            return newNames;
        });
        }
    };

    const handleDeleteBox = () => {
        if (selectedBoxIndex !== null) {
        setBoxPositions((prev) => prev.filter((_, i) => i !== selectedBoxIndex));
        setBoxSizes((prev) => prev.filter((_, i) => i !== selectedBoxIndex));
        setBoxColors((prev) => prev.filter((_, i) => i !== selectedBoxIndex));
        setBoxNames((prev) => prev.filter((_, i) => i !== selectedBoxIndex));
        setContextMenuOpen(false);
        }
    };

    useEffect(() => {
        const fetchSavedLocations = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/warehouses/get-locations/${warehouse.idwarehouse}`);
                if (response.ok) {
                    const data = await response.json();

                    console.log(data)
                    setBoxPositions(data.map((item: any) => item.position_loc.split(',').map(Number)));
                    setBoxSizes(data.map((item: any) => item.size_loc.split(',').map(Number)));
                    setBoxColors(data.map((item: any) => item.color_loc));
                    setBoxNames(data.map((item: any) => item.name_loc));
                } else {
                    console.error('Failed to fetch locations.');
                }
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchSavedLocations();
    }, [warehouse.idwarehouse]);

    const handleSave = async () => {
        const dataToSave = boxPositions.map((position, index) => ({
        name: boxNames[index],
        position,
        size: boxSizes[index],
        color: boxColors[index],
        }));
    
        try {
            console.log(dataToSave)
            const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/warehouses/save-locations/${warehouse.idwarehouse}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ figures: dataToSave }),
            });
        
            if (response.ok) {
                navToWarehouseMain();
            } else {
                console.error('Failed to save data.');
            }
        } catch (error) {
            console.error('An error occurred while saving data:', error);
        }
    };

    console.log(boxPositions)

  return (
    <>
        <div className="pb-[10px] 930:flex-1 font-manrope">
            <div className="hidden 930:block">
            <button className="w-full" onClick={navToWarehouseMain}><Heading title="Warehouse Configuration" /></button>
            </div>
            <div className="px-[40px] 930:px-0 mb-[27px] 930:mb-[34px]">
            <div className="pt-[25px] 930:text-left border-b border-lightgray pb-[17px]
                930:pl-[29px] 930:py-[30px] 930:w-full 930:border-none 930:pb-0 flex items-center">
                <button className='930:hidden max-w-[18px]'>
                <img src={BackBtn} alt="Back button" />
                </button>
                <div className="flex-grow flex justify-center 930:justify-start text-[1.15rem]">
                <h2 className="font-medium">
                    {warehouse.name_warehouse} Warehouse
                </h2>
                </div>
            </div>
            </div>
        </div>

        <div className='max-w-[300px] w-full md:max-w-[500px] 930:max-w-none mx-auto 930:mx-0 930:px-[29px]'>
            <div className='flex flex-col gap-4 930:flex-row 930:items-center 930:flex-wrap'>
                <div className='flex flex-col gap-4'>
                    <label className='text-black'>
                    Width (X)
                    </label>
                    <input
                    type="number"
                    value={newSize[0]}
                    onChange={(e) => setNewSize([parseFloat(e.target.value), newSize[1], newSize[2]])}
                    className='w-full md:w-auto md:min-w-[200px] border border-black rounded-[7px] py-[10px] pl-[10px] outline-none'
                    />
                </div>
                <div className='flex flex-col gap-4'>
                    <label className='text-black'>
                    Height (Z)
                    </label>
                    <input
                    type="number"
                    value={newSize[1]}
                    onChange={(e) => setNewSize([newSize[0], parseFloat(e.target.value), newSize[2]])}
                    className='w-full md:w-auto md:min-w-[200px] border border-black rounded-[7px] py-[10px] pl-[10px] outline-none'
                    />
                </div>
                <div className='flex flex-col gap-4'>
                    <label className='text-black'>
                    Depth (Y)
                    </label>
                    <input
                    type="number"
                    value={newSize[2]}
                    onChange={(e) => setNewSize([newSize[0], newSize[1], parseFloat(e.target.value)])}
                    className='w-full md:w-auto md:min-w-[200px] border border-black rounded-[7px] py-[10px] pl-[10px] outline-none'
                    />
                </div>
                <div className='flex flex-col gap-4'>
                    <label className='text-black'>
                    Color
                    </label>
                    <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className='h-full w-full md:w-auto md:min-w-[200px] border border-black rounded-[7px] py-[10px] px-[10px] appearance-none cursor-pointer outline-none'
                    />
                </div>
                <div className='flex flex-col gap-4'>
                    <label className='text-black'>&nbsp;
                    </label>
                    <button onClick={handleAddBox} className="w-full hover:opacity-70 bg-blue text-white font-bold py-2 px-4 rounded">ADD</button>
                </div>
            </div>

            <div className="flex mt-3">
                <div className="w-full border md:w-2/3 h-[50vh] md:h-[50vh] md:min-w-[500px]">
                    <Canvas shadows className="w-full h-full"  camera={{ position: [10, 10, 10], fov: 50 }}>
                    <ambientLight />
                    <pointLight position={[10, 10, 10]} />

                    <Plane
                        args={[20, 20]}
                        rotation={[-Math.PI / 2, 0, 0]}
                        position={[0, -0.5, 0]} // Adjusted height to make the boxes appear closer to the ground
                        receiveShadow
                    >
                        <meshStandardMaterial color="lightblue" />
                        <Edges color="black" />
                    </Plane>

                    {boxPositions.map((pos, index) => (
                        <DraggableBox
                        key={index}
                        position={pos}
                        size={boxSizes[index]}
                        color={boxColors[index]}
                        name={boxNames[index]}
                        setPosition={(newPos) => updateBoxPosition(index, newPos)}
                        otherBoxes={boxPositions.filter((_, i) => i !== index)}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        isDragging={isDragging}
                        setIsDragging={setIsDragging}
                        onClick={(e) => handleBoxClick(index, e)}
                        />
                    ))}

                    <OrbitControls enabled={!isDragging} />
                    </Canvas>
                </div>
            </div>

            {contextMenuOpen && selectedBoxIndex !== null && (
            <ContextMenu
                position={contextMenuPosition}
                name={boxNames[selectedBoxIndex]}
                onNameChange={handleNameChange}
                onDelete={handleDeleteBox}
                onClose={() => setContextMenuOpen(false)}
            />
            )}
        </div>
        
        <div className='max-w-[300px] w-full md:max-w-[500px] 930:max-w-none mx-auto 930:mx-0 930:px-[29px] mt-3'>
            <div className='flex flex-col gap-4'>
                <button onClick={handleSave} className="hover:opacity-70 w-full 930:w-1/6 bg-blue text-white font-bold py-2 px-4 rounded">SAVE</button>
            </div>
        </div>
    </>
  );
};

export default Threejs;