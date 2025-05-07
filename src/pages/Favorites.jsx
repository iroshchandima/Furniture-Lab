import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { FaHeart, FaSearch } from "react-icons/fa";

export default function Favorites() {
  const { favorites } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get unique categories from favorites
  const categories = [
    "all",
    ...new Set(favorites.map((item) => item.category)),
  ];

  // Filter favorites based on search and category
  const filteredFavorites = favorites.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold">My Favorites</h1>
        <p className="text-gray-600">
          {favorites.length} {favorites.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      {favorites && favorites.length > 0 ? (
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search bar */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search your favorites..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFavorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredFavorites.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No favorites match your search criteria.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaHeart className="mx-auto text-gray-300 text-6xl mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Your favorites list is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Start adding items to your favorites to keep track of products you
            love.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Explore Products
          </Link>
        </div>
      )}
    </div>
  );
}
