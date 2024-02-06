const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const cors = require('cors');



// Create express app
const app = express();
const port = 3000;
app.use(cors());
//app.use(express.json());


app.use(express.json()); // Body parsing middleware
app.use(express.urlencoded({ extended: true }));// Body parsing middleware

// Create pool
const pool = new Pool({
user: process.env.PSQL_USER,
host: process.env.PSQL_HOST,
database: process.env.PSQL_DATABASE,
password: process.env.PSQL_PASSWORD,
port: process.env.PSQL_PORT,
ssl: {rejectUnauthorized: false}
});

process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});

app.set("view engine", "ejs");
app.get('/', (req, res) => {
    res.send('hello world');
    
});

app.get('/user', async(req, res) => {
    try {
        const all = await pool.query('SELECT * FROM employees;');
        //console.log(all);
        res.json(all.rows);
    }
    catch (err) {
        res.status(500).json({error: 'Internal server error'})
    }
});
//

// get all items from inventory
app.get('/menu', async(req,res) => { // endpoint for menu storage is /menu
    
    try {
        const all = await pool.query('SELECT * FROM inventory;');

        res.json(all.rows);
    }
    catch (err) {
        res.status(500).json({error: 'Internal server error'})
    }
        
});

app.get('/featured-items', async(req,res) => { 
        try {
            const items = await pool.query('SELECT * FROM topItems;');
            res.json(items.rows);
        }
        catch (err) {
            res.status(500).json({error: 'Internal server error'})
        }
            
    });


app.get('/menu/cashieritems',async(req,res) => {
   try {
        const items = await pool.query('SELECT item_id, product_name, price FROM inventory ORDER BY item_id asc;');
        res.json(items.rows);
   } 
   catch (err) {
    console.error(err.message);
   }
});

// get a single item
app.get('/menu/:id', async(req,res) => {
    const { id } = req.params
    try {
        const item = await pool.query("SELECT * FROM inventory WHERE item_id = $1", [id]);
        res.json(item.rows[0]);
    }
    catch (err) {
        console.error(err.message);
    }
});

app.get('/orders/largest-order-id', async(req,res) =>{
    try {
        const queryResult = await pool.query('SELECT MAX(order_ID) AS largest_orderid FROM orders;');

        // Extracting largestOrderId
        const largestOrderID = queryResult.rows[0].largest_orderid;

        // Send largestOrderID via JSOn
        res.json({largest_orderid: largestOrderID});
    } catch (err){
        console.error("Server Side Error: ",err.message);
    }
});

app.get('/orders/largest-orderDetail-id', async(req,res) =>{
    try {
        const queryResult = await pool.query('SELECT MAX(orderdetailid) AS largest_orderdetailid FROM order_details;');

        // Extracting largestOrderId
        const largestOrderDetailID = queryResult.rows[0].largest_orderdetailid;

        // Send largestOrderID via JSOn
        res.json({largest_orderdetailid: largestOrderDetailID});
    } catch (err){
        console.error("Server Side Error: ",err.message);
    }
});

app.post('/orders/submitOrder', async(req, res) =>{

    const { order_id, price, employee_id, customer_id, order_time } = req.body;

    await pool.query(`INSERT INTO orders (order_id, price, employee_id, customer_id, order_time) VALUES ($1, $2, $3, $4, $5);`, [order_id, price, employee_id, customer_id, order_time], (error, results) => {
        if (error) {
            console.error('Error inserting order into the database:', error);
        }
       console.log(`Order added with ID: ${order_id}`)
    })
});

app.post('/orders/submitOrderDetail', async(req, res) =>{

    const { orderdetailid, orderid, productid, quantity} = req.body;

    await pool.query(`INSERT INTO order_details (orderdetailid, orderid, productid, quantity) VALUES ($1, $2, $3, $4);`,  [orderdetailid, orderid, productid, quantity], (error) => {
        if (error) {
            console.error('Error inserting order into the database:', error);
        } else {
            console.log()
            console.log('OrderDetail added with Order Detail ID:', orderdetailid, 'and Quantity:', quantity);
        }
    })
});

app.get('/manager/orderLog', async(req, res) =>{

    try {
        const queryResult = await pool.query('SELECT order_id, price, order_time FROM orders ORDER BY order_time DESC LIMIT 100;');
        res.json(queryResult.rows);

    } catch (err){
        console.error("Server Side Error: ",err.message);
    }
});
app.get('/manager/salesRevenue/Restock', async(req, res) =>{

    try {
        const queryResult = await pool.query('SELECT product_name, quantity, minimum_threshold, price FROM inventory WHERE quantity < minimum_threshold;');
        res.json(queryResult.rows);

    } catch (err){
        console.error("Server Side Error: ",err.message);
    }
});
app.get('/manager/salesRevenue/orderIDSGivenDate', async(req, res) =>{

    try {
        const queryResult = await pool.query("SELECT DISTINCT order_id " +
        "FROM orders " +
        "WHERE order_time >= $1 " +
        "AND order_time <= $2;",
      [req.query.startDate, req.query.endDate]);
        res.json(queryResult.rows);

    } catch (err){
        console.error("Server Side Error: ",err.message);
    }
});
app.get('/manager/salesRevenue/validDate', async(req, res) =>{

    try {
        const queryResult = await pool.query(
            'SELECT COUNT(*) AS total FROM orders WHERE DATE(order_time) >= TO_DATE($1, \'YYYY-MM-DD\') AND DATE(order_time) <= TO_DATE($2, \'YYYY-MM-DD\')',
            [req.query.startDate, req.query.endDate]
          );
        const totalCount = queryResult.rows[0].total;
        res.json({ total: totalCount });
    } catch (err){
        console.error("Server Side Error: ",err.message);
    }
});

app.get('/manager/salesRevenue/productOccurrences', async (req, res) => {
    try {
        const queryResult = await pool.query(
            'SELECT productid, COUNT(*) as occurrence_count FROM order_details WHERE orderid = $1 GROUP BY productid',
            [req.query.orderID]
        );
        const result = queryResult.rows.map(row => ({
            productid: row.productid,
            frequency: row.occurrence_count,
        }));
        res.status(200).json(result);
    } catch (error) {
        console.error('Error retrieving product occurrences:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/manager/salesRevenue/getAllInventoryData', async (req, res) => {
    try {
        console.log('Received request to fetch all inventory data.');

        const queryResult = await pool.query(
            'SELECT item_id, quantity FROM inventory'
        );

        if (queryResult.rows.length > 0) {
            const result = queryResult.rows.map(row => ({
                item_id: row.item_id,
                total_amount: row.quantity,
            }));
            console.log('All inventory data fetched successfully:', result);
            res.status(200).json(result);
        } else {
            console.log('No inventory data found.');
            // If no data found, return an empty array
            res.status(200).json([]);
        }
    } catch (error) {
        console.error('Error retrieving all inventory data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/manager/salesRevenue/salesTrend', async(req, res) =>{
    try {
        const { orderIds } = req.query;
    
        if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
          return res.status(400).json({ error: 'Invalid or missing order IDs' });
        }
    
        const queryResult = await pool.query(
          'SELECT orderid, productid FROM order_details WHERE orderid = ANY($1)',
          [req.query.orderIds]
        );
    
        const frequencyTable = {};

        // Track occurrences of product pairs across different order IDs
        queryResult.rows.forEach(orderDetail => {
            const { orderid, productid } = orderDetail;
      
            if (!frequencyTable[orderid]) {
              frequencyTable[orderid] = [];
            }
      
            // Update frequencyTable with the current product_id
            frequencyTable[orderid].push(productid);
        });
        res.json(frequencyTable);
    } catch (err) {
        console.error('Server Side Error: ', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//const axios = require('axios');
app.get('/weather', async (req,res) => {
    try {
        const baseURL = 'http://api.weatherapi.com/v1';
        const hourly = '/forecast.json';

        const latitude = req.query.lat || '30.628';
        const longitude = req.query.lon || '-96.3344';
        params = {
            key: '419728eec27f477186f233012230408',
            q: `${latitude},${longitude}`,
            days: '1'
        }
        const response = await axios.get(`${baseURL}${hourly}`, {params});
        res.json(response.data)
    }
    catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/addUser', async (req, res) => {
    try {
      const { employee_id, sales_made, employee_name, employee_role } = req.body;
      // Validate the input data
      if (!employee_id || !employee_name  || !employee_role) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      // Execute the SQL query to insert the new item into the database
      const queryResult = await pool.query(
        'INSERT INTO employees (employee_id, sales_made, employee_name,  employee_role) VALUES ($1, $2, $3, $4) RETURNING *;',
        [employee_id, sales_made, employee_name, employee_role]
      );
        
      // Extract the newly added item from the query result
      const newItem = queryResult.rows[0];
      // Send the newly added item via JSON
      res.json(newItem);
    } catch (err) {
      console.error('Server Side Error: ', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/deleteUser', (req, res) => {
    const userName = req.body.userName;

    // Perform the delete operation based on the item name
    pool.query(`DELETE FROM employees WHERE employee_name='${userName}'`, (err, result) => {
        if (err) {
            console.error('Error deleting item:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (result.rowCount > 0) {
                res.status(200).json({ message: 'Item deleted successfully' });
            } else {
                res.status(404).json({ error: 'Item not found' });
            }
        }
    });
});
app.post('/addItem', async (req, res) => {
    try {
      const { item_id, product_name, quantity, minimum_threshold, price, reorder_price, item_type } = req.body;
  
      // Validate the input data
      if (!item_id || !product_name || !quantity || !minimum_threshold || !price || !reorder_price || !item_type) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Execute the SQL query to insert the new item into the database
      const queryResult = await pool.query(
        'INSERT INTO inventory (item_id, product_name, quantity, minimum_threshold, price, reorder_price, item_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
        [item_id, product_name, quantity, minimum_threshold, price, reorder_price, item_type]
      );
  
      // Extract the newly added item from the query result
      const newItem = queryResult.rows[0];
  
      // Send the newly added item via JSON
      res.json(newItem);
    } catch (err) {
      console.error('Server Side Error: ', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/customer/:phoneNumber', async (req, res) => {
    try {
        console.log('Received request to fetch customer data from Phone Number.');

        // Access the phone number from the request parameters
        const phoneNumber = req.params['phoneNumber']; // make sure it is in req and not res

        console.log('Phone Number:', phoneNumber);

        const queryResult = await pool.query(
            'SELECT * FROM customer WHERE phone_number = $1;',
            [phoneNumber]
        );

        if (queryResult.rows.length > 0) {
            const result = queryResult.rows[0];
            console.log('Customer data fetched successfully:', result);
            res.json(result);
        } else {
            console.log('No customer data found.');
            // If no data found, return an empty object
            res.status(200).json({});
        }
    } catch (error) {
        console.error('Error retrieving customer data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/customer/:customer_id', async (req, res) => {
    try {
        const customerId = req.params['customer_id'];
        const { customer_id, email, phone_number, points } = req.body;

        // Perform the update in the database
        const updateQuery = 'UPDATE customer SET customer_id = $1, email = $2, phone_number = $4, points = $5 WHERE customer_id = $3';
        const values = [customer_id, email, customerId, phone_number, points];
       
        const updateResult = await pool.query(updateQuery, values);

        if (updateResult.rowCount > 0) {
            console.log('Customer data updated successfully.');
            // Can fetch and return the updated customer data
            const updatedCustomer = await pool.query('SELECT * FROM customer WHERE customer_id = $1', [customerId]);
            res.status(200).json(updatedCustomer.rows[0]);
        } else {
            console.log('No customer data updated.');
            res.status(404).json({ error: 'Customer not found' });
        }
    } catch (error) {
        console.error('Error updating customer data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/employee/:employee_id', async (req, res) => {
    try {
        console.log('Received request to fetch Employee data from Employee Id.');

        // Access the phone number from the request parameters
        const employeeID = req.params['employee_id']; // make sure it is in req and not res

        console.log('Employee ID:', employeeID);

        const queryResult = await pool.query(
            'SELECT * FROM employees WHERE employee_id = $1;',
            [employeeID]
        );

        if (queryResult.rows.length > 0) {
            const result = queryResult.rows[0];
            console.log('Employee data fetched successfully:', result);
            res.json(result);
        } else {
            console.log('No Employee data found.');
            // If no data found, return an empty object
            res.status(200).json({});
        }
    } catch (error) {
        console.error('Error retrieving Employee data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.delete('/manager/orderLog/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
  
    try {
      // Execute a DELETE query to remove the order by its ID
      const queryText = 'DELETE FROM orders WHERE order_id = $1';
      const result = await pool.query(queryText, [orderId]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Respond with a success message
      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      console.error('Error while deleting order:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
app.put('/employee/:employee_id', async (req, res) => {
    try {
        const employeeId = req.params['employee_id'];
        const { employee_id, sales_made, employee_name, employee_role } = req.body;

        // Perform the update in the database
        const updateQuery = 'UPDATE employees SET employee_id = $1, sales_made = $2, employee_name = $4, employee_role = $5 WHERE employee_id = $3';
        const values = [employee_id, sales_made, employeeId, employee_name, employee_role];
       
        const updateResult = await pool.query(updateQuery, values);

        if (updateResult.rowCount > 0) {
            console.log('Employee data updated successfully.');
            // Can fetch and return the updated customer data
            const updatedEmployee = await pool.query('SELECT * FROM employees WHERE employee_id = $1', [employeeId]);
            res.status(200).json(updatedEmployee.rows[0]);
        } else {
            console.log('No Employee data updated.');
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        console.error('Error updating Employee data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/get-management-token', async (req, res) => {
    try {
      const clientId = 'zdVr9bQtNTGHBMfkangHqNrek3412WAW';
      const clientSecret = 'GddZ5y34cU2gAdYUpKvG_XLgfugO4Dhr_11uof6jQRR5GWwe5zHSSLn_hBgB2wWZ';
      const auth0Domain = 'dev-x6hkl6gbuo2upckf.us.auth0.com';
  
      // Use Client Credentials Flow to obtain the Management API Access Token
      const response = await axios.post(`https://${auth0Domain}/oauth/token`, {
        client_id: clientId,
        client_secret: clientSecret,
        audience: `https://${auth0Domain}/api/v2/`,
        grant_type: 'client_credentials'
      });
  
      const accessToken = response.data.access_token;
  
      // Send the accessToken to the frontend
      res.json({ accessToken });
    } catch (error) {
      console.error('Error obtaining Management API Access Token:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
app.post('/deleteItem', (req, res) => {
    const itemName = req.body.itemName;

    // Perform the delete operation based on the item name
    pool.query(`DELETE FROM inventory WHERE product_name='${itemName}'`, (err, result) => {
        if (err) {
            console.error('Error deleting item:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (result.rowCount > 0) {
                res.status(200).json({ message: 'Item deleted successfully' });
            } else {
                res.status(404).json({ error: 'Item not found' });
            }
        }
    });
});

app.post('/updateUser', (req, res) => {
    const itemName = req.body.itemName;
    const newAttributes = req.body.newAttributes;
  
    // Perform the update operation based on the item name and new attributes
    pool.query(
      `UPDATE employees SET 
      sales_made = $1, 
      employee_role = $2
      WHERE employee_name = $3`,
      [
        newAttributes.sales_made,
        newAttributes.employee_role,
        itemName,
      ],
      (err, result) => {
        if (err) {
          console.error('Error updating item:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          if (result.rowCount > 0) {
            res.status(200).json({ message: 'Item updated successfully' });
          } else {
            res.status(404).json({ error: 'Item not found' });
          }
        }
      }
    );
  });

app.post('/updateinventory', (req, res) => {
    const itemName = req.body.itemName;
    const newAttributes = req.body.newAttributes;
  
    // Perform the update operation based on the item name and new attributes
    pool.query(
      `UPDATE inventory SET 
      quantity = $1, 
      minimum_threshold = $2, 
      price = $3, 
      reorder_price = $4 
      WHERE product_name = $5`,
      [
        newAttributes.quantity,
        newAttributes.minimum_threshold,
        newAttributes.price,
        newAttributes.reorder_price,
        itemName,
      ],
      (err, result) => {
        if (err) {
          console.error('Error updating item:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          if (result.rowCount > 0) {
            res.status(200).json({ message: 'Item updated successfully' });
          } else {
            res.status(404).json({ error: 'Item not found' });
          }
        }
      }
    );
  });


  app.get('/topitems', async(req,res) => { // endpoint for invenmenutory storage is /menu
    
    try {
        const all = await pool.query('SELECT * FROM topItems;');

        res.json(all.rows);
        //console.log(all);
    }
    catch (err) {
        res.status(500).json({error: 'Internal server error'})
    }
        
});

  app.post('/updatetopmenu', (req, res) => {
    const item_id = req.body.item_id;
    console.log(item_id);
    const newAttributes = req.body.newAttributes;
    console.log(newAttributes);
    // Perform the update operation based on the item name and new attributes
    pool.query(
      `UPDATE topItems SET 
        combination = $1
        WHERE item_id = $2`,
      [
        newAttributes.newTopitem,
        item_id,
      ],
      (err, result) => {
        if (err) {
          console.error('Error updating item:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          if (result.rowCount > 0) {
            res.status(200).json({ message: 'Item updated successfully' });
          } else {
            res.status(404).json({ error: 'Item not found' });
          }
        }
      }
    );
  });

  
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


// app.listen(port, () => {

//      console.log(`Example app listening at http://localhost:${port}`);
// });

