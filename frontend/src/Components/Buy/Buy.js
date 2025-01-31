import './buy.css'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductDisplay from './product_display'; // Ensure this is the correct import

export default function Buy() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem('authToken');
    
  useEffect(() => {
    // Fetch products data when the component mounts
    const fetchProducts = async () => {
      try {
        const response = await axios.post("http://localhost:5000/AllProducts",{
          Authorization: token
        });
        // console.log('API response:', response.data); // Log the data to ensure it's correct
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }); // Empty dependency array means this effect runs once on mount

  const ProductSold = async function (id, quantity){
    const token = localStorage.getItem('authToken');
    console.log(id)
    if(quantity===0){
      alert("Quatity can't be 0")
    }else{
    try {
      const response = await axios.post('http://localhost:5000/ProductBuying',{
        Authorization: token,
        uniqueId : id,
        quantity:quantity
      }) 
      
      alert(response.data.msg)
      window.location.reload();
    }catch(err){
      alert(err)
    }}
  }
  if (!products || products.length === 0) {
    return <div className="product_dispaly-no-products">No products available</div>;
  }
  return (
    <div>
      <div id="buy-outer">
        <h1 id="buy-heading">PRODUCTS LISTED</h1>
        <div className='buy-flexx'>
          
          <div id="buy-inner">
          <div className="product_dispaly">
            {products.map(product => <ProductDisplay product={product} ProductSold={ProductSold}/>)}
            {/* <ProductDisplay products={products} /> Pass the products data */}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
