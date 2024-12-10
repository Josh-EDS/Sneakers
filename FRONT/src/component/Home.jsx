import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter } from 'lucide-react';

// Categories mapping
const CATEGORIES = {
  1: 'Mobile',
  2: 'Télévision',
  3: 'Autres'
};

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch products on component mount
  useEffect(() => {
    fetch('http://localhost:1337/api/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data.data);
        setFilteredProducts(data.data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  // Search and filter logic
  useEffect(() => {
    let result = products;

    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      result = result.filter(product => 
        product.category_id === selectedCategory
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  // Add to cart function
  const addToCart = (product) => {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? {...item, quantity: item.quantity + 1} 
          : item
      ));
    } else {
      setCart([...cart, {...product, quantity: 1}]);
    }
  };

  // Remove from cart function
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  return (
    <div className="container mx-auto p-4">

      <div className="flex mb-6 space-x-4">
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Rechercher des produits..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded-lg"
          />
          <Search className="absolute left-3 top-3 text-gray-400" />
        </div>

        <select 
          className="p-2 border rounded-lg"
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Toutes les catégories</option>
          {Object.entries(CATEGORIES).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            className="border rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow"
          >
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-48 object-cover rounded-t-lg mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">{product.price} €</span>
              <button 
                onClick={() => addToCart(product)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                Ajouter au Panier
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Sidebar */}
      {cart.length > 0 && (
        <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">Mon compte</h2>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-4 pb-4 border-b">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p>{item.price} € x {item.quantity}</p>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                Supprimer
              </button>
            </div>
          ))}
          <div className="font-bold text-xl mt-4">
            Total: {cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)} €
          </div>
          <button className="w-full bg-orange-600 text-white p-3 rounded-lg mt-4 hover:bg-orange-700">
            Passer la commande
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;