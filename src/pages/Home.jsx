import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { products, categories } from "../data/products";

function HeroSection() {
  return (
    <div className="relative h-[600px] bg-primary-900">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/images/hero.png"
          alt="Modern living room"
          className="w-full h-full object-cover opacity-50"
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl font-display font-bold text-white mb-6"
          >
            Experience Furniture in 3D
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-primary-100 mb-8"
          >
            Visualize your perfect space with our interactive 3D models
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              to="/category/living-room"
              className="inline-block bg-accent-600 text-white px-8 py-3 rounded-lg hover:bg-accent-700 transition-colors"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FeaturedProducts() {
  const featuredProducts = products.filter((product) => product.featured);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-display font-bold text-primary-900 mb-8">
          Featured Collection
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group"
            >
              <Link to={`/product/${product.id}`}>
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg font-medium text-primary-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-primary-600">${product.price.toFixed(2)}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategorySection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-display font-bold text-primary-900 mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group"
            >
              <Link to={`/category/${category.id}`}>
                <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-medium text-white mb-2">
                      {category.name}
                    </h3>
                    <p className="text-primary-100">{category.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  const testimonials = [
    {
      id: 1,
      text: "The 3D visualization feature helped me make the perfect choice for my living room. It's like having the furniture in your home before buying!",
      author: "Sarah Johnson",
      role: "Interior Designer",
    },
    {
      id: 2,
      text: "Exceptional quality and the ability to see how furniture fits in my space made the decision-making process so much easier.",
      author: "Michael Chen",
      role: "Homeowner",
    },
    {
      id: 3,
      text: "The virtual room feature is a game-changer. I could experiment with different colors and arrangements before making my purchase.",
      author: "Emily Rodriguez",
      role: "Architect",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-display font-bold text-primary-900 mb-12 text-center">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 p-6 rounded-lg"
            >
              <p className="text-primary-600 mb-4">{testimonial.text}</p>
              <div>
                <p className="font-medium text-primary-900">
                  {testimonial.author}
                </p>
                <p className="text-sm text-primary-500">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturedProducts />
      <CategorySection />
      <TestimonialSection />
    </div>
  );
}
