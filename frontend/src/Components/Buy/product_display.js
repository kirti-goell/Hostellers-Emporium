import React, { useState } from 'react';
import './product_display.css'; // Import the CSS file
import axios from 'axios'

function ProductDisplay({ product, ProductSold }) {
  const [quantity,setQuantity] = useState(0);
  const quantitydown = function(){
    if(quantity-1>=0){
      setQuantity(quantity-1);
    }
  }
  const quantityup =function(uplimit){
    if(quantity+1<=uplimit){
      setQuantity(quantity+1);
    }
  } 
  
  
  let a = "http://localhost:5000"
  return (
        <div key={product.id} className="product-item">
          <div className="product_display-img-div">
          <img className="product_display-img" src = {a+product.ImagePath} alt = "NO img By Seller"></img>
          </div>
          <div className="product_dispaly-all-div"> <h2 className="product_dispaly-name">ProductName = {product.ProductName}</h2>
          <p className="product_dispaly-Quanity">Quantity = {product.Quantity}</p>
          <p className="product_dispaly-price">Price = ${product.Price}</p>
          <p className="product_dispaly-rating">Rating = {product.rating} &#9733; from {product.sold} Customers </p>
          <p className='product_display-box2'>
            <span>Review &darr;</span>
            {product.review.map(veiw=>(
              <div className='hidden2'>
                <ul>{veiw.by} Says {veiw.review}</ul>
              </div>
            ))}
          </p>
          <p className="product_dispaly-extra">Extra = {product.Extra}</p>
          {/* <button
            className="product_display-buy"
            onClick={() => ProductSold(product.uniqueId)}
          >Buy</button> */}
          </div>
          <div className='product_display-count'>
            <button className='product_display-count-button' onClick={()=>{quantitydown()}}>-</button>
            <button className='product_display-count-val'>{quantity}</button>
            <button className='product_display-count-button' onClick={()=>{quantityup(product.Quantity)}}>+</button>
          </div>
          <button
            className="product_display-buy"
            onClick={() => ProductSold(product.uniqueId, quantity)}
          >Buy</button>
        </div>
  );
}

export default ProductDisplay;

