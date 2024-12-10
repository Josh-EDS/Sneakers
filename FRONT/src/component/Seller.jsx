import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:1337/api';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);

  const fetchData = async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      return { data: [] };
    }
  };

  const ProductsSection = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const addProduct = async (e) => {
      e.preventDefault();
      try {
        await fetch(`${API_BASE_URL}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: {
              name,
              price: parseFloat(price),
              description,
              image_url: imageUrl,
            },
          }),
        });
        fetchProducts();
        setName('');
        setPrice('');
        setDescription('');
        setImageUrl('');
      } catch (error) {
        console.error('Error creating product:', error);
      }
    };

    const deleteProduct = async (documentId) => {
      try {
        await fetch(`${API_BASE_URL}/products/${documentId}`, { method: 'DELETE' });
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    };

    const updateProduct = async (documentId, field, newValue) => {
      try {
        await fetch(`${API_BASE_URL}/products/${documentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: { [field]: newValue },
          }),
        });
        fetchProducts();
      } catch (error) {
        console.error('Error updating product:', error);
      }
    };

    return (
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <h2 className="text-xl font-bold mb-4">Your Products</h2>
        <form onSubmit={addProduct} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-grow p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-24 p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-grow p-2 border rounded"
          />
          <input
            type="url"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-grow p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Product
          </button>
        </form>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Image</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="border p-2">{product.id}</td>
                <td
                  className="border p-2 cursor-pointer"
                  onClick={() => {
                    const newName = prompt('Enter new name:', product.name);
                    if (newName) updateProduct(product.documentId, 'name', newName);
                  }}
                >
                  {product.name}
                </td>
                <td
                  className="border p-2 cursor-pointer"
                  onClick={() => {
                    const newPrice = prompt('Enter new price:', product.price);
                    if (newPrice) updateProduct(product.documentId, 'price', newPrice);
                  }}
                >
                  {product.price}
                </td>
                <td
                  className="border p-2 cursor-pointer"
                  onClick={() => {
                    const newDescription = prompt('Enter new description:', product.description);
                    if (newDescription)
                      updateProduct(product.documentId, 'description', newDescription);
                  }}
                >
                  {product.description}
                </td>
                <td
                  className="border p-2 cursor-pointer"
                  onClick={() => {
                    const newImageUrl = prompt('Enter new image URL:', product.image_url);
                    if (newImageUrl) updateProduct(product.documentId, 'image_url', newImageUrl);
                  }}
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => deleteProduct(product.documentId)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const result = await fetchData('products');
    setProducts(result.data);
  };

  return (
    <div className="container mx-auto p-4">
      <ProductsSection />
    </div>
  );
};

export default AdminDashboard;
