# Database Schema Notes

## Table Names (Important for Backend Routes)

The actual database uses these exact table names:

- `Manufacturer` (not `manufacturer`)
- `Category` (not `category`)
- `Product` (not `product`)
- `ProductCategory` (not `Product_Category`)
- `Customer` (not `customer`)
- `Account` (not `account`)
- `PaymentInfo` (not `Payment_Info`)
- `Location` (not `location`)
- `Inventory` (not `inventory`)
- `Orders` (not `Order` - note the 's' at the end)
- `OrderItems` (not `Order_Item`)
- `Shipping` (not `Shipment`)
- `Reorder` (not `reorder`)
- `ReorderDelivery` (not `Reorder_Delivery`)

## Key Differences from Initial Schema

1. **Orders table**: Uses `Orders` (plural) to avoid Oracle reserved word issues
2. **Junction tables**: Use camelCase (`ProductCategory`, `OrderItems`) instead of snake_case
3. **Customer table**: Has `has_account` BOOLEAN field
4. **Orders.customerID**: Can be NULL for online orders without accounts
5. **Date fields**: Use DATE type (not DATETIME)
6. **PaymentInfo**: Uses `expiration_date` as DATE (not VARCHAR)

## Column Naming

- Most use camelCase: `customerID`, `orderID`, `productID`
- Some use snake_case: `has_account`, `billingCycleDate`, `expiration_date`
- Be consistent when writing queries

## Important Constraints

- `Orders.customerID` can be NULL
- `Orders.locationID` only required for in-person orders
- `Orders.accountID` is nullable
- `Orders.paymentID` only for online orders
- `Customer.email` is online-only (can be NULL)

