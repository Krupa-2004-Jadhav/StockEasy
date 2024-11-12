// server/models/User.js
const mongoose = require('mongoose');

// Schema for individual stock holdings
const holdingSchema = new mongoose.Schema({
  stockSymbol: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  averagePrice: { type: Number, required: true, min: 0 },
});

// Main User Schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  age: { type: Number, required: true, min: 18 },
  password: { type: String, required: true },
  holdings: { type: [holdingSchema], default: [] }, // Array of stock holdings
  cash: { type: Number, default: 100000, min: 0 }, // User's available cash
  todaysChange: { type: Number, default: 0 },
  annualReturn: { type: Number, default: 0 },
}, { timestamps: true });

// Virtual fields for calculated values
userSchema.virtual('accountValue').get(function () {
  let holdingsValue = this.holdings.reduce((total, holding) => {
    return total + holding.quantity * holding.averagePrice;
  }, 0);
  return this.cash + holdingsValue;
});

userSchema.virtual('buyingPower').get(function () {
  // 50% margin on holdings value
  return this.cash + (this.accountValue - this.cash) * 0.5;
});

// Instance method to update or add a stock holding
userSchema.methods.buyStock = function (stockSymbol, quantity, pricePerShare) {
  const existingHolding = this.holdings.find(h => h.stockSymbol === stockSymbol);
  const totalCost = quantity * pricePerShare;

  if (existingHolding) {
    const newQuantity = existingHolding.quantity + quantity;
    existingHolding.averagePrice = 
      ((existingHolding.averagePrice * existingHolding.quantity) + totalCost) / newQuantity;
    existingHolding.quantity = newQuantity;
  } else {
    this.holdings.push({ stockSymbol, quantity, averagePrice: pricePerShare });
  }

  this.cash -= totalCost;
};

// Instance method to sell a stock holding
userSchema.methods.sellStock = function (stockSymbol, quantity, pricePerShare) {
  const existingHolding = this.holdings.find(h => h.stockSymbol === stockSymbol);
  if (!existingHolding || existingHolding.quantity < quantity) {
    throw new Error("Insufficient holdings to sell");
  }

  const totalSale = quantity * pricePerShare;
  existingHolding.quantity -= quantity;

  // Remove holding if quantity is zero
  if (existingHolding.quantity === 0) {
    this.holdings = this.holdings.filter(h => h.stockSymbol !== stockSymbol);
  }

  this.cash += totalSale;
};

// Method to recalculate portfolio metrics
userSchema.methods.updateMetrics = async function (getCurrentStockPrice) {
  let holdingsValue = 0;
  for (const holding of this.holdings) {
    const currentPrice = await getCurrentStockPrice(holding.stockSymbol);
    holdingsValue += holding.quantity * currentPrice;
  }
  this.accountValue = this.cash + holdingsValue;
  this.buyingPower = this.cash + holdingsValue * 0.5;
  this.annualReturn = ((this.accountValue - 100000) / 100000) * 100;
  await this.save();
};

// Ensure virtual fields are included in JSON output
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
