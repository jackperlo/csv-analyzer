# CSV Orders Analyzer

## Overview

This script reads order data from a CSV file, analyzes the data to find records with the highest total amount, highest quantity, and the largest difference between total cost without discount and total cost with discount. The results are then printed to the console.

## How to Execute

### Prerequisites

- Node.js installed on your system.
- The npm packages installed. You can install it by running:

  ```bash
  npm i
  ```

## Execution

Run the script using Node.js with the path to your CSV file as an argument:

  ```bash
  node orders_analyzer.js data.csv
  ```

## Example of Obtained Output

```bash
Record with the highest total amount:
Id: 2, Article Name: Coke, Quantity: 15, Unit price: 2, Percentage discount: 0, Buyer: Luca Neri

Record with the highest quantity:
Id: 4, Article Name: Water, Quantity: 20, Unit price: 1, Percentage discount: 10, Buyer: Mario Rossi

Record with the largest difference between total without discount and total with discount:
Id: 4, Article Name: Water, Quantity: 20, Unit price: 1, Percentage discount: 10, Buyer: Mario Rossi
```

## Script Details

### Functions

- **calculateTotalAndDifference(price, quantity, discount)**:
  Calculates the total cost of an order before and after applying the discount.

- **ordersAnalyzer(orders)**:
  Analyzes an array of orders to find the records with the highest total cost, highest quantity, and largest difference between total cost without and with discount.

- **readOrdersFromCsvFile(csvDataFilePath)**:
  Reads orders from a CSV file and returns them as an array of objects.

- **main(csvDataFilePath)**:
  The main function that orchestrates reading the orders from the CSV file, analyzing them, and logging the results.

### Error Handling

- The script checks if the provided file exists and is a valid file.
- If no data is provided through the CSV file, an error is thrown, and no further analysis is executed.
- If the script is run without the required argument, it will display a usage message.
