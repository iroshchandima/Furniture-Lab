import { useState, useEffect, Suspense, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  TransformControls,
  Grid as DreiGrid,
} from "@react-three/drei";
import FurnitureModel from "../components/3d/FurnitureModel";
import { products } from "../data/products";
import {
  PlusIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

// Placement spot component
function PlacementSpot({ position, onClick, isHovered }) {
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(position);
      }}
    >
      <circleGeometry args={[0.3, 32]} />
      <meshStandardMaterial
        color={hovered ? "#4CAF50" : "#8BC34A"}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

// Generate grid of placement spots
function PlacementSpots({ onSpotClick, roomWidth, roomLength, visible }) {
  if (!visible) return null;

  const spots = [];
  const spacingX = 1;
  const spacingZ = 1;

  for (let x = -roomWidth / 2 + 1; x <= roomWidth / 2 - 1; x += spacingX) {
    for (let z = -roomLength / 2 + 1; z <= roomLength / 2 - 1; z += spacingZ) {
      spots.push(
        <PlacementSpot
          key={`${x}-${z}`}
          position={[x, 0.01, z]}
          onClick={onSpotClick}
        />
      );
    }
  }

  return spots;
}

// Room component
function Room({ wallColor = "#ffffff", width = 5, length = 5, height = 3 }) {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Walls */}
      <group position={[0, height / 2, 0]}>
        {/* Back wall */}
        <mesh position={[0, 0, -length / 2]} receiveShadow>
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial color={wallColor} />
        </mesh>

        {/* Left wall */}
        <mesh
          position={[-width / 2, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          receiveShadow
        >
          <planeGeometry args={[length, height]} />
          <meshStandardMaterial color={wallColor} />
        </mesh>

        {/* Right wall */}
        <mesh
          position={[width / 2, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          receiveShadow
        >
          <planeGeometry args={[length, height]} />
          <meshStandardMaterial color={wallColor} />
        </mesh>
      </group>
    </group>
  );
}

// Draggable furniture component
function DraggableFurniture({
  modelUrl,
  position,
  rotation,
  scale,
  color,
  isSelected,
  onSelect,
}) {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...position);
      groupRef.current.rotation.set(...rotation);
      groupRef.current.scale.set(scale, scale, scale);
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <group ref={groupRef}>
      <FurnitureModel
        modelPath={modelUrl}
        scale={scale}
        color={color}
        onClick={handleClick}
      />
      {isSelected && (
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial
            color="yellow"
            emissive="yellow"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
    </group>
  );
}

// Furniture catalog component
function FurnitureCatalog({ onAddFurniture }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-accent-600 text-white rounded-lg flex items-center space-x-2"
      >
        <PlusIcon className="h-5 w-5" />
        <span>Add More Furniture</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl p-4 z-50">
          <h3 className="font-medium text-lg mb-4">Available Furniture</h3>
          <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {products.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onAddFurniture(item);
                  setIsOpen(false);
                }}
                className="text-left p-2 hover:bg-gray-50 rounded-lg"
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-sm text-primary-600">${item.price}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Controls panel component
function ControlsPanel({
  wallColor,
  setWallColor,
  roomWidth,
  setRoomWidth,
  roomLength,
  setRoomLength,
  roomHeight,
  setRoomHeight,
  isOpen,
  onToggle,
}) {
  return (
    <>
      <div
        className={`fixed right-0 top-0 h-full bg-white shadow-lg transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "320px" }}
      >
        <div className="p-6">
          <h2 className="text-xl font-medium mb-6">Room Settings</h2>

          {/* Room Dimensions */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-4">Dimensions</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-primary-600 mb-2">
                  Width: {roomWidth}m
                </label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  step="0.1"
                  value={roomWidth}
                  onChange={(e) => setRoomWidth(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-primary-600 mb-2">
                  Length: {roomLength}m
                </label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  step="0.1"
                  value={roomLength}
                  onChange={(e) => setRoomLength(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-primary-600 mb-2">
                  Height: {roomHeight}m
                </label>
                <input
                  type="range"
                  min="2"
                  max="4"
                  step="0.1"
                  value={roomHeight}
                  onChange={(e) => setRoomHeight(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Wall Color */}
          <div>
            <h3 className="text-sm font-medium mb-4">Wall Color</h3>
            <input
              type="color"
              value={wallColor}
              onChange={(e) => setWallColor(e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-l-lg shadow-lg"
      >
        {isOpen ? (
          <ChevronRightIcon className="h-6 w-6" />
        ) : (
          <ChevronLeftIcon className="h-6 w-6" />
        )}
      </button>
    </>
  );
}

export default function RoomDesigner() {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef();
  const [roomFurniture, setRoomFurniture] = useState([]);
  const [selectedFurnitureIndex, setSelectedFurnitureIndex] = useState(null);
  const [wallColor, setWallColor] = useState("#ffffff");
  const [roomWidth, setRoomWidth] = useState(5);
  const [roomLength, setRoomLength] = useState(5);
  const [roomHeight, setRoomHeight] = useState(3);
  const [controlsOpen, setControlsOpen] = useState(true);
  const [orbitControlsEnabled, setOrbitControlsEnabled] = useState(true);

  // Initialize with the product from navigation state
  useEffect(() => {
    if (location.state?.product) {
      const { product } = location.state;
      setRoomFurniture([
        {
          ...product,
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: product.customizations?.scale || 1,
          color: product.customizations?.color || "#FFFFFF",
        },
      ]);
    }
  }, [location.state]);

  // Handle keyboard controls
  const handleKeyDown = (e) => {
    if (selectedFurnitureIndex === null) return;

    const key = e.key.toLowerCase();
    console.log("Key pressed:", key);

    setRoomFurniture((prev) => {
      const moveSpeed = 0.1;
      const rotateSpeed = Math.PI / 4; // 45 degrees for more noticeable rotation
      return prev.map((item, i) => {
        if (i !== selectedFurnitureIndex) return item;

        const [x, y, z] = item.position;
        const [rotX, rotY, rotZ] = item.rotation;
        let newPosition = [x, y, z];
        let newRotation = [rotX, rotY, rotZ];

        switch (key) {
          case "w":
          case "arrowup":
            newPosition = [x, y, z - moveSpeed];
            break;
          case "s":
          case "arrowdown":
            newPosition = [x, y, z + moveSpeed];
            break;
          case "a":
          case "arrowleft":
            newPosition = [x - moveSpeed, y, z];
            break;
          case "d":
          case "arrowright":
            newPosition = [x + moveSpeed, y, z];
            break;
          case "q":
            newPosition = [x, y + moveSpeed, z];
            break;
          case "e":
            newPosition = [x, y - moveSpeed, z];
            break;
          case "r": // Y axis clockwise (rotate right)
            newRotation = [rotX, rotY + rotateSpeed, rotZ];
            break;
          case "f": // Y axis counterclockwise (rotate left)
            newRotation = [rotX, rotY - rotateSpeed, rotZ];
            break;
          default:
            return item;
        }

        console.log("Moving from", item.position, "to", newPosition);
        console.log("Rotating from", item.rotation, "to", newRotation);
        return { ...item, position: newPosition, rotation: newRotation };
      });
    });
  };

  const handleAddFurniture = (item) => {
    setRoomFurniture((prev) => [
      ...prev,
      {
        ...item,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: 1,
        color: "#FFFFFF",
      },
    ]);
  };

  const handleFurnitureSelect = (index) => {
    console.log("Selecting furniture:", index);
    setSelectedFurnitureIndex(index);
    setOrbitControlsEnabled(false);
  };

  const handleSpotClick = (position) => {
    console.log("Spot clicked at position:", position);
    if (selectedFurnitureIndex !== null) {
      setRoomFurniture((prev) => {
        const newFurniture = [...prev];
        newFurniture[selectedFurnitureIndex] = {
          ...newFurniture[selectedFurnitureIndex],
          position: position,
        };
        return newFurniture;
      });
      setSelectedFurnitureIndex(null);
      setOrbitControlsEnabled(true);
    }
  };

  const handleCanvasClick = (e) => {
    // Only deselect if clicking on the canvas background
    if (e.target === canvasRef.current) {
      console.log("Canvas background clicked, deselecting furniture");
      setSelectedFurnitureIndex(null);
      setOrbitControlsEnabled(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeftIcon className="h-6 w-6 text-primary-700" />
              </button>
              <h1 className="text-2xl font-display font-bold text-primary-900">
                Room Designer
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {selectedFurnitureIndex !== null && (
                <div className="bg-white px-4 py-2 rounded-lg shadow text-sm">
                  <div className="mb-2">
                    Use WASD or Arrow keys to move the selected item
                    <br />
                    Q/E to move up/down
                    <br />
                    R/F to rotate furniture direction
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm">Color:</label>
                      <input
                        type="color"
                        value={
                          roomFurniture[selectedFurnitureIndex]?.color ||
                          "#FFFFFF"
                        }
                        onChange={(e) => {
                          setRoomFurniture((prev) => {
                            const newFurniture = [...prev];
                            newFurniture[selectedFurnitureIndex] = {
                              ...newFurniture[selectedFurnitureIndex],
                              color: e.target.value,
                            };
                            return newFurniture;
                          });
                        }}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                    </div>
                    <button
                      onClick={() => {
                        setRoomFurniture((prev) =>
                          prev.filter(
                            (_, index) => index !== selectedFurnitureIndex
                          )
                        );
                        setSelectedFurnitureIndex(null);
                        setOrbitControlsEnabled(true);
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                    >
                      Delete Item
                    </button>
                  </div>
                </div>
              )}
              <FurnitureCatalog onAddFurniture={handleAddFurniture} />
            </div>
          </div>
        </div>
      </div>

      {/* Room Designer */}
      <div
        className="relative h-[calc(100vh-80px)]"
        onClick={handleCanvasClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={canvasRef}
        style={{ outline: "none" }}
      >
        <Canvas shadows camera={{ position: [5, 5, 5], fov: 60 }}>
          <Suspense fallback={null}>
            <Room
              wallColor={wallColor}
              width={roomWidth}
              length={roomLength}
              height={roomHeight}
            />

            <PlacementSpots
              onSpotClick={handleSpotClick}
              roomWidth={roomWidth}
              roomLength={roomLength}
              visible={selectedFurnitureIndex !== null}
            />

            {roomFurniture.map((item, index) => (
              <DraggableFurniture
                key={index}
                modelUrl={item.modelUrl}
                position={item.position}
                rotation={item.rotation}
                scale={item.scale}
                color={item.color}
                isSelected={selectedFurnitureIndex === index}
                onSelect={() => handleFurnitureSelect(index)}
              />
            ))}

            <DreiGrid
              infiniteGrid
              cellSize={1}
              sectionSize={1}
              fadeDistance={30}
              fadeStrength={1}
            />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
            <OrbitControls
              makeDefault
              enabled={orbitControlsEnabled}
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 2}
              enableDamping={false}
            />
            <Environment preset="apartment" />
          </Suspense>
        </Canvas>

        {/* Controls Panel */}
        <ControlsPanel
          wallColor={wallColor}
          setWallColor={setWallColor}
          roomWidth={roomWidth}
          setRoomWidth={setRoomWidth}
          roomLength={roomLength}
          setRoomLength={setRoomLength}
          roomHeight={roomHeight}
          setRoomHeight={setRoomHeight}
          isOpen={controlsOpen}
          onToggle={() => setControlsOpen(!controlsOpen)}
        />
      </div>
    </div>
  );
}
