const fs = require('fs');
const csv = require('csv-parser');


/**
 * Calculates the total cost of an order before and after discount.
 *
 * @param {number} price - The price per unit of the order.
 * @param {number} quantity - The quantity of units of the order.
 * @param {number} discount - The percentage discount for the order.
 * @returns {object} An object containing the total cost without discount and the difference between the total cost without and with discount.
 */
const calculateTotalAndDifference = (price, quantity, discount) => {
  const totalWithoutDiscount = price * quantity;
  /*
  DISCOUNT COMPUTATION disclaimer:
  Since no further specifications have been issued, the discount percentage has been considered as a per order discount.
    e.g. Order_x: 5 items, 2 bucks per item, 10 % discount => 10% of (5*2)$.
  */
  const totalWithDiscount = totalWithoutDiscount - [(price * quantity * discount) / 100];
  return { totalWithoutDiscount, difference: totalWithoutDiscount - totalWithDiscount };
};

/**
 * Analyzes an array of orders and returns the order with the highest total cost, highest quantity, and largest difference between total cost without and with discount.
 *
 * @param {array} orders - An array of order objects.
 * @returns {object} An object containing the order with the highest total cost, the order with the highest quantity, and the order with the largest difference between total cost without and with discount.
 */
const ordersAnalyzer = (orders) => {
  let highestTotalRecord = null;
  let highestQuantityRecord = null;
  let highestDifferenceRecord = null;

  orders.forEach((order) => {
    const { totalWithoutDiscount, difference } = calculateTotalAndDifference(order.Unit_Price, order.Quantity, order.Percentage_Discount);

    if (!highestTotalRecord || totalWithoutDiscount > parseInt(highestTotalRecord.totalWithoutDiscount))
      highestTotalRecord = {...order, totalWithoutDiscount};

    if (!highestQuantityRecord || parseInt(order.Quantity) > parseInt(highestQuantityRecord.Quantity))
      highestQuantityRecord = {...order};
      
    if (!highestDifferenceRecord || difference > parseInt(highestDifferenceRecord.difference))
      highestDifferenceRecord = {...order, difference};
  
  });

  return { highestTotalRecord, highestQuantityRecord, highestDifferenceRecord };
};

/**
 * Reads orders from a CSV file and returns them as an array of objects.
 *
 * @param {string} csvDataFilePath - The file path of the CSV data file.
 * @returns {array} An array of order objects.
 */
const readOrdersFromCsvFile = (csvDataFilePath) => {
  return new Promise((resolve, reject) => {
    fs.stat(csvDataFilePath, (error, stats) => {
      if (error) reject(`Error: file ${csvDataFilePath} does not exist`);
      else if (!stats.isFile()) reject(`Error: ${csvDataFilePath} is not a file`);
      else {
        const orders = [];
        fs.createReadStream(csvDataFilePath)
          .pipe(csv())
          .on('data', (dataChunk) => orders.push(dataChunk))
          .on('end', () => resolve(orders))
          .on(error, reject);
      }
    });
  });
};

/**
 * The main function that reads orders from a CSV file, analyzes them, and logs the results to the console.
 *
 * @param {string} csvDataFilePath - The file path of the CSV data file.
 */
const main = async (csvDataFilePath) => {
  try {
    const orders = await readOrdersFromCsvFile(csvDataFilePath);
    if(!orders || orders.length == 0)
      throw new Error('No data has been provided through the .csv file.\nNo further analysis will be computed');

    const { highestTotalRecord, highestQuantityRecord, highestDifferenceRecord } = ordersAnalyzer(orders);

    console.log('\nRecord with the highest total amount:');
    console.log(`Id: ${highestTotalRecord.Id}, Article Name: ${highestTotalRecord.Article_Name}, Quantity: ${highestTotalRecord.Quantity}, Unit price: ${highestTotalRecord.Unit_Price}, Percentage discount: ${highestTotalRecord.Percentage_Discount}, Buyer: ${highestTotalRecord.Buyer}`);

    console.log('\nRecord with the highest quantity:');
    console.log(`Id: ${highestQuantityRecord.Id}, Article Name: ${highestQuantityRecord.Article_Name}, Quantity: ${highestQuantityRecord.Quantity}, Unit price: ${highestQuantityRecord.Unit_Price}, Percentage discount: ${highestQuantityRecord.Percentage_Discount}, Buyer: ${highestQuantityRecord.Buyer}`);

    console.log('\nRecord with the largest difference between total without discount and total with discount:');
    console.log(`Id: ${highestDifferenceRecord.Id}, Article Name: ${highestDifferenceRecord.Article_Name}, Quantity: ${highestDifferenceRecord.Quantity}, Unit price: ${highestDifferenceRecord.Unit_Price}, Percentage discount: ${highestDifferenceRecord.Percentage_Discount}, Buyer: ${highestDifferenceRecord.Buyer}\n`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv.length!== 3) {
  console.error('Missing Argument\nUsage example: node process_csv.js <path_to_csv_data>');
  process.exit(1);
}

main(process.argv[2]);