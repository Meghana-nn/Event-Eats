import React, { useState } from 'react';
import { itemData } from '../data';
import '../App.css';

function ItemsDisplay() {
  const [display, setDisplay] = useState(itemData);
  console.log(display, "the data");

  const handleClick = (item) => {
    alert(`You clicked on ${item.name}`);
  };

  return (
    <div className='itemSection'>
        <h4>Top Menus</h4>
      <div className='front-cardContainer'>
        {display.map((item, i) => {
          return (
            <div className='front-card' key={i} onClick={() => handleClick(item)}>
              <img src={item.item_img} alt={`Item${i}`} className='front-cardImage' />
              <div className='front-cardContent'>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ItemsDisplay;
