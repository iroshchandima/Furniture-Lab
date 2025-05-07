import { useState, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import FurnitureModel from "../components/3d/FurnitureModel";
import { products } from "../data/products";
import {
  ShoppingCartIcon,
  HeartIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/outline";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToFavorites, removeFromFavorites, favorites } =
    useAppContext();
  const [quantity, setQuantity] = useState(1);
  const [isCustomizingColor, setIsCustomizingColor] = useState(false);
  const product = products.find((p) => p.id === parseInt(id));
  const [selectedColor, setSelectedColor] = useState(
    product?.specs?.color || "#FFFFFF"
  );
  const [scale, setScale] = useState(100);
  const [cameraX, setCameraX] = useState(0);
  const [cameraY, setCameraY] = useState(1);

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  const isFavorite = favorites.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const handleTryInRoom = () => {
    navigate("/room-designer", {
      state: {
        product: {
          ...product,
          customizations: {
            color: selectedColor,
            scale: scale / 100,
          },
        },
      },
    });
  };

  // Available colors for the product
  const availableColors = [
    "#FFFFFF", // White
    "#8B4513", // Brown
    "#808080", // Gray
    "#000000", // Black
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* 3D Model Viewer */}
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg" style={{ height: "500px" }}>
            <Canvas>
              <Suspense fallback={null}>
                <PerspectiveCamera
                  makeDefault
                  position={[cameraX, cameraY, 5]}
                />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <FurnitureModel
                  modelPath={product.modelUrl}
                  scale={scale / 100}
                  color={selectedColor}
                  autoRotate
                />
                <OrbitControls />
                <Environment preset="apartment" />
              </Suspense>
            </Canvas>
          </div>

          {/* Customization Controls */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-primary-900 mb-4">
              Customize
            </h3>

            {/* Color Customization Toggle */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isCustomizingColor}
                  onChange={(e) => {
                    setIsCustomizingColor(e.target.checked);
                    if (!e.target.checked) {
                      setSelectedColor(product.specs.color);
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-primary-700">
                  Customize Color
                </span>
              </label>
            </div>

            {/* Color Selection */}
            {isCustomizingColor && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-lg border-2 ${
                        selectedColor === color
                          ? "border-accent-600"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Adjustment */}
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Size: {scale}%
              </label>
              <input
                type="range"
                min="80"
                max="120"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Camera Angle Controls */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Camera X Position: {cameraX}
              </label>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.1"
                value={cameraX}
                onChange={(e) => setCameraX(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Camera Y Position: {cameraY}
              </label>
              <input
                type="range"
                min="-2"
                max="5"
                step="0.1"
                value={cameraY}
                onChange={(e) => setCameraY(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleTryInRoom}
              className="px-6 py-2 rounded-lg flex items-center space-x-2 bg-accent-600 text-white hover:bg-accent-700"
            >
              <ViewfinderCircleIcon className="h-5 w-5" />
              <span>Try in Room</span>
            </button>
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-primary-900">
              {product.name}
            </h1>
            <p className="mt-2 text-2xl text-primary-700">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-primary-900 mb-2">
              Description
            </h2>
            <p className="text-primary-600">{product.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-primary-900 mb-2">
              Specifications
            </h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="border-t pt-4">
                  <dt className="font-medium text-primary-900 capitalize">
                    {key}
                  </dt>
                  <dd className="mt-1 text-primary-600">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Add to Cart Section */}
          <div className="border-t pt-8">
            <div className="flex items-center space-x-4 mb-4">
              <label
                htmlFor="quantity"
                className="font-medium text-primary-900"
              >
                Quantity
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="rounded-lg border-gray-300"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-accent-600 text-white px-6 py-3 rounded-lg hover:bg-accent-700 flex items-center justify-center space-x-2"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`p-3 rounded-lg border ${
                  isFavorite
                    ? "bg-primary-100 border-primary-200 text-primary-900"
                    : "border-gray-300 text-primary-700 hover:bg-gray-50"
                }`}
              >
                <HeartIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
