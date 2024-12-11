import React, { useState, useEffect } from "react";
import { ChevronLeft, ShoppingCart, Truck, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const getLastSegment = () => {
    const pathSegments = window.location.pathname.split("/");
    return pathSegments[pathSegments.length - 1];
  };
  
  useEffect(() => {
    const fetchProduct = async () => {
      const productId = getLastSegment(); 
      const API_URL = `http://localhost:1337/api/products/${productId}`;
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Impossible de charger les détails du produit.");
        }
        const result = await response.json();
        setProduct(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  const handleAddToCart = () => {
    // Logique d'ajout au panier
    toast.success(`${quantity} ${product.name} ajouté(s) au panier`, {
      position: "top-right",
      duration: 2000,
    });
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity(prev => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-fnac-red"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <h2 className="text-2xl text-red-500 mb-4">Erreur de chargement</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <button 
        onClick={handleGoBack} 
        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
      >
        Retour à l'accueil
      </button>
    </div>
  );
  
  return (
    <div className="pt-100 container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <button 
        className="mb-4 flex items-center text-gray-700 hover:text-black transition" 
        onClick={handleGoBack}
      >
        <ChevronLeft className="mr-2" /> Retour
      </button>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 grid md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="max-h-[400px] object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-fnac-blue mb-2">{product.name}</h1>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-fnac-red">{product.price} €</span>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button 
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition" 
                  onClick={() => handleQuantityChange("decrement")}
                >
                  -
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button 
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition" 
                  onClick={() => handleQuantityChange("increment")}
                >
                  +
                </button>
              </div>
            </div>

            <button 
              className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center" 
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2" /> Paiement
            </button>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Truck className="mr-2 text-fnac-blue" />
                Livraison à partir de 9,90 €
              </div>
              <div className="flex items-center">
                <ShieldCheck className="mr-2 text-green-600" />
                Garantie 2 ans
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage; 