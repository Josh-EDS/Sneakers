import React, { useState, useEffect } from "react";

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
          throw new Error("Failed to fetch product data.");
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

  if (loading) return <div className="text-center text-gray-500 p-4">Chargement...</div>;
  
  if (error) return <div className="text-center text-red-500 p-4">Erreur : {error}</div>;
  
  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="border border-gray-200 p-4 flex items-center justify-center h-[600px]">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-[300px] h-[300px]"
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-fnac-blue">{product.name}</h1>
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-lg font-semibold text-black">{product.description}</p>
          </div>
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded">
            <span className="text-3xl font-bold text-fnac-red">{product.price} €</span>
            <button className="bg-fnac-red text-white px-6 py-2 rounded hover:bg-red-700 transition">
              Ajouter au panier
            </button>
          </div>
          <div className="text-sm text-gray-600 border-t pt-4">
            <p>📦 Livraison à partir de 9,90 €</p>
            <p>🛡️ Garantie 2 ans</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;