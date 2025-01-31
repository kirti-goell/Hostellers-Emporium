import React, { useState } from 'react';
import './product_display.css'; // Import the CSS file
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
function ProductDisplay({ products }) {
  const [isUpdate, setUpdate] = useState({
    name: "",
    quantity: 0,
    extra: "",
    price: 0
  });
  const Navigate = useNavigate();
  if (!products || products.length === 0) {
    return <div className="product_dispaly-no-products">No products available</div>;
  }
  const UpdateProductFunction = async function(){
    const token = localStorage.getItem('authToken');
    try{
      const response = await axios.post('http://localhost:5000/UpdateProduct',{
        Authorization: token,
        ProductName : isUpdate.name,
        Quantity: isUpdate.quantity,
        Price: isUpdate.price,
        Extra: isUpdate.extra
      })
      alert(response.data.msg)
      window.location.reload();
    }catch(e){
      alert(e);
    }
  }
  const DeleteProductFunction= async function(name){
    const token = localStorage.getItem('authToken');
    try{
      const response = await axios.post('http://localhost:5000/DeleteProduct',{
        Authorization: token,
        ProductName : name
      })
      alert(response.data.msg)
      window.location.reload();
    }catch(e){
      alert(e);
    }
  }
  const Approving = async function (id,time,ChatId) {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(`http://localhost:5000/Approving/${id}/${time}/${ChatId}`,{
      Authorization: token
    })
    alert(response.data.msg) 
    window.location.reload();
  }

  const Chating = function(ChatId){
    localStorage.setItem("ChatId",ChatId);
    Navigate('/ChatingRoom');
  }
  const handleUpdateChange = (e) => {
    let target = e.target;
    setUpdate({...isUpdate, [e.target.name]: e.target.value});
  }

  return (
    <div className="product_display2" >
      {isUpdate.name !== "" && (<div className="update-outer-cont">
      <div className="update-inner-cont">
        <h2>Product Name : {isUpdate.name}</h2>
        <form onSubmit={UpdateProductFunction}>
          <label htmlFor='quantity'>Quantity : </label>
          <input id='quantity' type="number" name="quantity" value={isUpdate.quantity} placeholder='quantity' onChange={handleUpdateChange}/><br />
          <label>Price : </label>
          <input type="number" name="price" value={isUpdate.price} placeholder='p' onChange={handleUpdateChange}/><br />
          <label>Description : </label>
          <input type="text" name="extra" value={isUpdate.extra} placeholder='e' onChange={handleUpdateChange}/><br/>
          <div className='product-display-btn-flex'>
          <button type="submit">Update</button><br/>
          <button type="button" onClick={() => {setUpdate({name: ""})}}>Cancel</button></div>
        </form>
      </div>
      </div>)}
  {products.map(product => (
    <div key={product.id} className="product-item2 productchange">
      <div className="card">
        <div className="card-front">
          <h2 className="product_display-name">ProductName = {product.ProductName}</h2>
          <p className="product_display-Quantity productchange-item">Quantity = {product.Quantity}</p>
          <p className="product_display-price productchange-item">Price = ${product.Price}</p>
          <p className="product_display-extra productchange-item">Extra = {product.Extra}</p>
          <br/>
          <p className="product_display-box productchange-item">
            <h5>InProgress</h5>
            <div className='hidden'>
            {product.InProgress.map(progress => (
              <div key={progress.id}>
                <p>Units = {progress.Units}</p>
                <p>Person = {progress.buyer}</p>
                <p>Time = {progress.time}</p>
                <button className='Progress-button' onClick={()=>{Approving(product.uniqueId,progress.time,progress.ChatId)}}>Delivered</button>
                <button className='Progress-button' onClick={()=>{Chating(progress.ChatId)}}> Chat </button>
                <br/><br/>
              </div>
            ))}
            </div>
          </p>
          <br/>
          <p className="product_display-box productchange-item">
            <h5>SoldUnits</h5>
            <div className='hidden'> 
            {product.SoldUnits.map(progress1 => (
              <div key={progress1.id}>
                <p>Units = {progress1.Units}</p>
                <p>Person = {progress1.buyer}</p>
                <p>Time = {progress1.time}</p>
                <br/>
              </div>
            ))}
            </div>
          </p>
          <br></br>
        </div>
        <div className="product-display-btn-flex">
          <button className='Delete-product' onClick={() => setUpdate({name: product.ProductName, quantity: product.Quantity, price: product.Price, extra: product.Extra})}>Update</button>
          <button className='Delete-product' onClick={() => DeleteProductFunction(product.ProductName)}>Delete</button>
        </div>
      </div>
    </div>
  ))}
</div>


  );
}

export default ProductDisplay;

