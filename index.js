const axios = require("axios");
const { writeFile, writeFileSync } = require("fs");

const getData = async function () {
  try {
    const res = await axios.get("https://api.escuelajs.co/api/v1/products");
    const data = res.data;
    return data;
  } catch (error) {
    console.error("unable to fetch data", error);
  }
};

const getExchangeRate = async function () {
  try {
    const res = await axios.get(
      "https://v6.exchangerate-api.com/v6/8a946c17762fa2c30024f5f8/latest/USD"
    );
    const exchangeRate = res.data.conversion_rates.EGP;
    return exchangeRate;
  } catch (error) {
    console.error("unable to fetch exchange rate", error);
  }
};

const convertingPrice = function (products, exchangeRate) {
  products.forEach((product) => {
    product.price = parseFloat((product.price * exchangeRate).toFixed(2));
  });
  return products;
};

const categorize = function (products) {
  const productsList = {};
  products.forEach((product) => {
    const { category } = product;
    if (!productsList[category.id]) {
      productsList[category.id] = {
        category: {
          id: category.id,
          name: category.name,
        },
        products: [],
      };
    }
    productsList[category.id].products.push(product);
  });
  return Object.values(productsList);
};

const showData = async function () {
  try {
    const data = await getData();
    const exchangeRate = await getExchangeRate();
    const afterPriceChange = convertingPrice(data, exchangeRate);
    const afterCatergorization = categorize(afterPriceChange);
    console.log(afterCatergorization);
    writeFileSync("output.json", SON.stringify(afterCatergorization), "utf-8");
  } catch (error) {
    console.error("error occured:", error);
  }
};
showData();
