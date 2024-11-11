import React, { useState } from 'react';
import './TradeScreen.css';

const TradeScreen = () => {
  const [symbol, setSymbol] = useState('');
  const [action, setAction] = useState('Buy');
  const [orderType, setOrderType] = useState('Market');
  const [duration, setDuration] = useState('Day only');
  const [quantity, setQuantity] = useState(0);

  const handleSymbolChange = (e) => setSymbol(e.target.value);
  const handleActionChange = (e) => setAction(e.target.value);
  const handleOrderTypeChange = (e) => setOrderType(e.target.value);
  const handleDurationChange = (e) => setDuration(e.target.value);
  const handleQuantityChange = (e) => setQuantity(e.target.value);

  const previewOrder = () => {
    // Logic to preview order will go here
    console.log(`Previewing order for ${quantity} shares of ${symbol}`);
  };

  return (
    <div className="trade-screen">
      <h2>Trade Screen</h2>
      <div className="trade-form">
        <label>
          Symbol
          <input type="text" value={symbol} onChange={handleSymbolChange} placeholder="Look up for Symbol/Company name" />
        </label>
        <label>
          Action
          <select value={action} onChange={handleActionChange}>
            <option>Buy</option>
            <option>Sell</option>
          </select>
        </label>
        <label>
          Quantity
          <input type="number" value={quantity} onChange={handleQuantityChange} />
        </label>
        <label>
          Order Type
          <select value={orderType} onChange={handleOrderTypeChange}>
            <option>Market</option>
            <option>Limit</option>
            <option>Stop</option>
            <option>Stop Limit</option>
          </select>
        </label>
        <label>
          Duration
          <select value={duration} onChange={handleDurationChange}>
            <option>Day only</option>
            <option>Good till cancelled</option>
          </select>
        </label>
        <button onClick={previewOrder}>Preview Order</button>
      </div>
    </div>
  );
};

export default TradeScreen;
