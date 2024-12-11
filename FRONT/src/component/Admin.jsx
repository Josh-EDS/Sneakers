import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import CryptoJS from "crypto-js";

const API_BASE_URL = 'http://localhost:1337/api';
const API_KEY = '958dab05804bdec2c3b535d313365a849cf623f0d0f43e22e64b9eaa5d0fb1583384ff43cd8ee0e759190cb0989687b509bdf941646adab38297655673d06e92181703dee84e530fa6b140c506ef36d3eabbce23dc20bfc3686782d046138284b347b2ba24e36f0c4b14db89f16eef9028346723d53c7b53178b7e9f4985b3e4';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [currentUserPermission, setCurrentUserPermission] = useState(null);

  const fetchData = async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      return { data: [] };
    }
  };

  const checkUserLogin = () => {
    const token = Cookies.get("Token");
    if (!token) {
      document.body.innerHTML = ''; 
      window.location.href = '/login';
      return null;
    }

    const bytes = CryptoJS.AES.decrypt(token, '92d7a9a5942a4a7c9b18d5046a5f8fa3b7f0bb7db5c64f2a4675d7d8a2d67f51');
    const decodedData = bytes.toString(CryptoJS.enc.Utf8).split(':');
    const decodedEmail = decodedData[0];

    if (!decodedEmail) {
      document.body.innerHTML = '';
      window.location.href = '/login';
    }

    return decodedEmail;
  };

  useEffect(() => {
    const userEmail = checkUserLogin();
    if (userEmail) {
      setCurrentUserEmail(userEmail);
      fetch('http://localhost:1337/api/user-ids')
        .then(response => response.json())
        .then(data => {
          const user = data.data.find(user => user.Email === userEmail);
          if (user) {
            setCurrentUserPermission(user.Permission_level);
          }
        })
        .catch(error => console.error('Error:', error));
    }
  }, []);

  const manageProducts = () => {
    const userEmail = checkUserLogin();
    if (!userEmail) {
      console.log('User not logged in');
      return;
    }
  
    fetch('http://localhost:1337/api/user-ids')
      .then(response => response.json())
      .then(data => {
        const user = data.data.find(user => user.Email === userEmail);
        const authorizedProduct = `Draft | ${userEmail}`;
  
        if (user) {
          console.log(user.Permission_level);
          if (user.Permission_level === 0) { 
            document.body.innerHTML = '';
            window.location.href = '/profile';
            return null;
          }
          if (user.Permission_level === 1) {
            const interval = setInterval(() => {
              const rows = document.querySelectorAll('tr.hover\\:bg-gray-50');
              let hasMatchingRows = false;
  
              rows.forEach(row => {
                if (!row.innerHTML.includes(authorizedProduct)) {
                  row.remove();
                } else {
                  hasMatchingRows = true;
                }
              });
  
              const deleteElem = document.querySelector('#Users');
              const deleteElem2 = document.querySelector('#Categories');
              
              if (deleteElem) deleteElem.remove();
              if (deleteElem2) deleteElem2.remove();
  
              if (!hasMatchingRows && !deleteElem && !deleteElem2) {
                clearInterval(interval);
                return 1;
              }
            }, 100);
          } else {
            if (user.Permission_level === 2) {
              const interval = setInterval(() => {
                const deleteElem = document.querySelector('#Users');
                if (deleteElem) {
                  deleteElem.remove()
                  clearInterval(interval);
                }
              }, 100);
            }
          }
        } else {
          console.log('Email not found');
        }
      })
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    manageProducts();
  }, []);

  const UsersSection = () => {
    const [email, setEmail] = useState('');
    const [permissionLevel, setPermissionLevel] = useState('');

    const addUser = async (e) => {
      e.preventDefault();
      try {
        await fetch(`${API_BASE_URL}/user-ids`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            data: {
              Email: email,
              Permission_level: parseInt(permissionLevel),
            },
          }),
        });
        fetchUsers();
        setEmail('');
        setPermissionLevel('');
      } catch (error) {
        console.error('Error creating user:', error);
      }
    };

    const deleteUser = async (documentId) => {
      try {
        await fetch(`${API_BASE_URL}/user-ids/${documentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
          },
        });
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    };

    const updateUser = async (documentId, field, newValue) => {
      try {
        await fetch(`${API_BASE_URL}/user-ids/${documentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            data: { [field]: newValue },
          }),
        });
        fetchUsers();
      } catch (error) {
        console.error('Error updating user:', error);
      }
    };

    return (
      <div className="bg-white shadow-md rounded-lg p-4 mb-4" id="Users">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <form onSubmit={addUser} className="flex gap-2 mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Permission Level"
            value={permissionLevel}
            onChange={(e) => setPermissionLevel(e.target.value)}
            className="w-24 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add User
          </button>
        </form>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Permission Level</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border p-2">{user.id}</td>
                <td
                  className="border p-2 cursor-pointer"
                  onClick={() => {
                    const newEmail = prompt('Enter new email:', user.Email);
                    if (newEmail) updateUser(user.documentId, 'Email', newEmail);
                  }}
                >
                  {user.Email}
                </td>
                <td
                  className="border p-2 cursor-pointer"
                  onClick={() => {
                    const newPermissionLevel = prompt(
                      'Enter new permission level:',
                      user.Permission_level
                    );
                    if (newPermissionLevel)
                      updateUser(user.documentId, 'Permission_level', newPermissionLevel);
                  }}
                >
                  {user.Permission_level}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => deleteUser(user.documentId)}
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

  const ProductsSection = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const addProduct = async (e) => {
      e.preventDefault();
      try {
        const productName = currentUserPermission === 1 
          ? `${name} -- Draft | ${currentUserEmail}` 
          : name;

        await fetch(`${API_BASE_URL}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            data: {
              name: productName,
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
        window.location.href = '/admin';
      } catch (error) {
        console.error('Error creating product:', error);
      }
    };

    const deleteProduct = async (documentId) => {
      try {
        await fetch(`${API_BASE_URL}/products/${documentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
          },
        });
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    };

    const updateProduct = async (documentId, field, newValue) => {
      try {
        const updatedValue = field === 'name' && currentUserPermission === 1
          ? `${newValue} -- Draft | ${currentUserEmail}`
          : newValue;

        await fetch(`${API_BASE_URL}/products/${documentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            data: { [field]: updatedValue },
          }),
        });
        fetchProducts();
        window.location.href = '/admin';
      } catch (error) {
        console.error('Error updating product:', error);
      }
    };

    return (
      <div className="bg-white shadow-md rounded-lg p-4 mb-4" id="Products">
        <h2 className="text-xl font-bold mb-4">Products</h2>
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
                    const newName = prompt('Enter new product name:', product.name);
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
                    if (newDescription) updateProduct(product.documentId, 'description', newDescription);
                  }}
                >
                  {product.description}
                </td>
                <td className="border p-2">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-24 h-24 object-cover mx-auto"
                    />
                  )}
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

  const CategoriesSection = () => {
    const [categoryName, setCategoryName] = useState('');

    const addCategory = async (e) => {
      e.preventDefault();
      try {
        await fetch(`${API_BASE_URL}/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            data: {
              name: categoryName,
            },
          }),
        });
        fetchCategories();
        setCategoryName('');
      } catch (error) {
        console.error('Error creating category:', error);
      }
    };

    const deleteCategory = async (documentId) => {
      try {
        await fetch(`${API_BASE_URL}/categories/${documentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
          },
        });
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    };

    const updateCategory = async (documentId, field, newValue) => {
      try {
        await fetch(`${API_BASE_URL}/categories/${documentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            data: { [field]: newValue },
          }),
        });
        fetchCategories();
      } catch (error) {
        console.error('Error updating category:', error);
      }
    };

    return (
      <div className="bg-white shadow-md rounded-lg p-4 mb-4" id="Categories">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <form onSubmit={addCategory} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="flex-grow p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Category
          </button>
        </form>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Category Name</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="border p-2">{category.id}</td>
                <td
                  className="border p-2 cursor-pointer"
                  onClick={() => {
                    const newCategoryName = prompt(
                      'Enter new category name:',
                      category.name
                    );
                    if (newCategoryName)
                      updateCategory(category.documentId, 'name', newCategoryName);
                  }}
                >
                  {category.name}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => deleteCategory(category.documentId)}
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
    fetchUsers();
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchUsers = async () => {
    const data = await fetchData('user-ids');
    setUsers(data.data);
  };

  const fetchProducts = async () => {
    const data = await fetchData('products');
    setProducts(data.data);
  };

  const fetchCategories = async () => {
    const data = await fetchData('categories');
    setCategories(data.data);
  };

  return (
    <div className="p-8 mx-auto max-w-screen-lg">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <UsersSection />
      <ProductsSection />
      <CategoriesSection />
    </div>
  );
};

export default AdminDashboard;
