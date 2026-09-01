
# Multi-Vendor Ecommerce Platform

A full-stack, role-based Multi-Vendor Ecommerce Platform built with React.js, Redux Toolkit, Node.js, Express.js, MongoDB, and Razorpay.

The application supports three primary user roles:

**Buyer** – Browse products, manage cart, checkout, place orders, track orders and submit reviews.    
**Seller** – Manage store, products, inventory, orders, shipments and notifications.    
**Admin** – Manage users, sellers, stores, products and orders from a centralized dashboard.   

The project is designed as a real-world ecommerce application with authentication, role-based authorization, seller/store management, product management, shopping cart, checkout, Razorpay payment integration, order management, email notifications and seller notification workflows.

## Live Demo
**Frontend:**    
https://ecommerce-nilesh.netlify.app/    

**Frontend Github Repository:**  
https://github.com/nileshkumar12/guvicct-frontend  


**Backend Github Repository:**   
https://github.com/nileshkumar12/guvicct     

## Demo Credentials
To make the application easy to evaluate, the repository should provide demo accounts for all supported roles.

**Buyer Account**/    
Email: nilesh.kumar12@gmail.com       
Password: sharma@123      
Role: Buyer     

**Seller Account**/      
Email: nitya@gmail.com     
Password: sharma@123    
Role: Seller      
 
**Admin Account**     
Email: nityadigitalinfotech@gmail.com     
Password: sharma@123    
Role: Admin     

##  Key Features 

### 1. User & Authentication
The application provides secure authentication using JWT-based authentication.
#### Buyer
- **User Registration** – New customers can create an account using their basic personal information.
- **User Login/Logout** – Buyers can securely sign in and sign out of the application.
- **JWT Authentication** – Authentication is handled using JSON Web Tokens for secure API access.
- **Protected Routes** – Sensitive pages such as checkout, orders, and profile are accessible only to authenticated users.
- **User Profile** – Buyers can view and manage their account information.
- **User Role Handling** – The application identifies the logged-in user's role and provides appropriate permissions.
- **Buyer-Specific Pages** – Buyers have access to shopping, cart, checkout, orders, profile, and other customer-specific pages.
- **Checkout Authentication** – Unauthenticated users are redirected to login when attempting to access checkout or place an order.

    
#### Seller
- **Seller Role** – Sellers have dedicated permissions for managing their store and products.
- **Seller Profile** – Sellers can view and manage their seller account information.
- **Seller Store Management** – Sellers can create and manage their own ecommerce store.
- **Seller Dashboard** – A dedicated dashboard provides access to products, orders, inventory, notifications, and store information.
- **Seller-Specific Products** – Sellers can manage only the products associated with their store.
- **Seller-Specific Orders** – Sellers can view and process orders containing their products.
- **Seller Notifications** – Sellers receive notifications when buyers place orders for their products.
- **Shipment Management** – Sellers can manage order/shipment status as orders move through the fulfillment process.


#### Admin
- **Admin Role** – Administrators have elevated permissions to manage and monitor the ecommerce platform.
- **Admin Profile** – Administrators can manage their account information.
- **Admin Dashboard** – Provides a centralized overview of the ecommerce platform.
- **Product Management** – Administrators can monitor and manage products across different stores.
- **Store Management** – Administrators can manage and monitor seller stores.
- **User Management** – Administrators can view and manage registered users and sellers.
- **Order/Shipment Management** – Administrators can monitor orders and shipment-related information across the platform.
    
### 2. Seller Store Management

Each seller can create and manage their own ecommerce store.

**Seller can create/manage their store.**

- **Store Name** – Defines the public name displayed to customers.
- **Slug** – Provides a unique URL-friendly identifier for the store.
- **Logo** – Sellers can upload a store logo to represent their brand.
- **Category** – Stores can be associated with a relevant business or product category.
- **Description** – Sellers can provide information about their business and products.
- **Phone** – Stores can maintain a business contact number.
- **Email** – Stores can provide a business email address for customer communication.
- **Address** – Sellers can maintain their store/business address.
- **GST Number** – Business tax information can be stored for applicable sellers.
- **PAN Number** – Seller business identification information can be maintained.
- **Opening Time** – Defines the store's operating start time.
- **Closing Time** – Defines the store's operating end time.
- **Status** – Sellers/admins can manage whether a store is active or inactive.

**Store Relatiionship**
Each store is associated with its seller/owner.
Products are also associated with a store so that sellers can manage only products belonging to their own store.

### 3. Product Management

Products can be managed by authorized sellers and administrators.

**Seller/Admin can:**

- **Add Product** – Sellers can create new products by entering product information, pricing, stock, category, and images.
- **Edit Product** – Existing product information can be updated whenever required.
- **Delete Product** – Authorized users can remove products that are no longer available.
- **Upload Product Image** – Product images can be uploaded and associated with the product.
- **Manage Product Price** – Sellers can define and update product pricing.
- **Manage Stock** – Sellers can maintain available inventory quantities.
- **Manage Category** – Products can be assigned to appropriate product categories.
- **Manage Description** – Sellers can provide detailed product descriptions for buyers.
- **Assign Product to Store** – Products are linked to the seller's store.
- **Manage Availability** – Products can be made available or unavailable depending on stock and business requirements.

 You also discussed proper handling of deleted product images/details.

**Product Information**
Typical product information includes:

- **Product Name** – The name displayed to customers.
- **Product Description** – Detailed information about the product.
- **Price** – Current selling price of the product.
- **Discount** – Optional discount applied to the original price.
- **Category** – Product classification used for browsing and organization.
- **Stock Quantity** – Number of units currently available.
- **Product Images** – Visual representation of the product.
- **Store** – The store from which the product is being sold.
- **Seller** – The seller/owner associated with the product.
- **Product Status** – Indicates whether the product is active or inactive.
- **Reviews** – Customer feedback and ratings associated with the product.

**Image Management**
Product and store images are managed using **Cloudinary**, allowing images to be uploaded, stored, and served through a cloud-based media service.


### 4. Product Listing

**Buyer can:**

The product listing module provides buyers with an easy way to browse the available ecommerce catalog.
- **View Products** – Buyers can browse products available across participating stores.
- **Product Details** – Buyers can open individual products to view complete product information.
- **Product Images** – Products are displayed with their associated images.
- **Product Price** – The current selling price is displayed to customers.
- **Stock Availability** – Buyers can see whether a product is available for purchase.
- **Product Category** – Product categories help organize the ecommerce catalog.
- **Product Reviews** – Customers can view ratings and reviews submitted by eligible buyers.
- **Add to Cart** – Available products can be added directly to the shopping cart.
- **Add to Wishlist** – Available products can be added directly to the wishlist to buy in future.

Product details provide buyers with the information required before adding products to their cart.

### 5. Product Reviews

The review system allows customers to provide feedback about products they have purchased.

- **Product Reviews** – Customers can view feedback from other buyers.
- **Review Submission** – Eligible buyers can submit ratings and written reviews.
- **Review Validation** – Review submissions are validated before being stored.
- **Review API** – Reviews are managed through backend APIs.
- **Verified Purchase Restriction** – Buyers can review only products they have successfully received.
- **Display Reviews** – Product pages display available customer reviews and ratings.


### 6. Shopping Cart

The shopping cart provides buyers with a persistent, user-specific shopping experience.

- **Add Product to Cart** – Buyers can add available products to their cart.
- **Increase Quantity** – Buyers can increase the quantity of a selected product.
- **Decrease Quantity** – Product quantity can be reduced directly from the cart.
- **Remove Product** – Individual products can be removed from the cart.
- **Product Quantity** – The cart maintains the selected quantity for every product.
- **Product Price** – Product prices are used to calculate the cart subtotal.
- **Stock Handling** – The system checks product availability before completing an order.
- **Cart Persistence** – Cart information can be maintained between shopping sessions.
- **User-Specific Cart** – Each buyer has their own cart rather than sharing cart data between users.


### 7. Checkout

The checkout module brings together cart information, shipping information, discounts, and payment selection before order placement.

- **Cart Summary** – Buyers can review all products selected for purchase.
- **Product Subtotal** – The system calculates the total price of products before discounts and shipping.
- **Discount** – Applicable discounts are deducted from the order subtotal.
- **Shipping Charge** – Shipping costs are calculated and added to the order total where applicable.
- **Final Total** – The system calculates the final amount payable by the buyer.
- **Shipping Address** – Buyers provide the address where the order should be delivered.
- **Buyer Information** – Customer contact information is collected for order processing.
- **Payment Method** – Buyers can select the available payment method.
- **Order Placement** – After validation and successful payment where applicable, the order is created.


### 8. Razorpay Payment Integration

The application integrates Razorpay for online payments (Test Demo Payment for now).     

The payment flow is designed so that a Razorpay order is created first and payment is verified before creating the final ecommerce order.

The backend validates:    

- **Razorpay Order ID** – Identifies the Razorpay order created for the transaction.     
- **Razorpay Payment ID** – Identifies the payment transaction.   
- **Razorpay Signature** – Used to verify that the payment response is authentic.   

This ensures that a successful ecommerce order is not created for an unverified Razorpay payment.

> **Demo Mode:** Razorpay is currently configured for test/demo payments. No real transaction is required for testing the application.

### 9. Order Management 

Order creation is implemented around a unique human-readable order number.
Dynamic Order Number
Email trigger to the user and notify to seller

**Example:**

ORD-20260813-103870

**Order Data Includes**

- **Order Number** – Unique reference number assigned to the order.
- **Buyer** – Identifies the customer who placed the order.
- **Products** – Contains products included in the order.
- **Quantity** – Stores the quantity purchased for each product.
- **Price** – Stores the purchase price of each product.
- **Shipping Address** – Delivery information provided by the buyer.
- **Subtotal** – Total product amount before discounts and shipping.
- **Discount** – Discount applied to the order.
- **Shipping** – Shipping cost associated with the order.
- **Total** – Final amount payable for the order.
- **Payment Method** – Payment method selected by the customer.
- **Payment Status** – Indicates the current payment state.
- **Order Status** – Indicates the current fulfillment status.
- **Razorpay Order ID** – Razorpay transaction order reference where applicable.
- **Razorpay Payment ID** – Razorpay payment reference where applicable.
- **Razorpay Signature** – Payment verification signature where applicable.
- **Created Date** – Date and time when the order was created.

### 10. Order Email Notifications

After an order is successfully placed, email notifications can be triggered.

**Buyer Notification**

After a successful order, the buyer can receive order information including:

- **Order Number** – Unique order reference.
- **Products** – Products included in the order.
- **Total Amount** – Final amount paid or payable.
- **Shipping Information** – Delivery address and related information.
- **Order Status** – Current order processing status.

**Seller Notification**

The seller is notified when a buyer places an order containing their product.    
This allows sellers to start processing the order without manually checking the dashboard.

**Email functionality is implemented using services/libraries such as:**
    Resend


### 11. Buyer Order History

The Buyer Dashboard provides access to previously placed orders.

**Buyer can view:**

- **Order Number** – Unique reference for the order.
- **Ordered Products** – Products purchased in the order.
- **Quantity** – Quantity purchased for each product.
- **Price** – Price at which products were purchased.
- **Shipping** – Shipping charges applied to the order.
- **Discount** – Discount applied to the order.
- **Total** – Final order amount.
- **Shipping Address** – Address used for delivery.
- **Order Status** – Current fulfillment status.
- **Order Details** – Complete information for the selected order.
- **Payment Details** – Payment method and relevant payment information.

### 12. Seller Order Management

Seller-specific access ensures that sellers can manage their own products and related orders without accessing another seller's private order information.

Sellers can use the order management area to:

- View relevant orders
- Check ordered products
- Review quantities
- Check customer shipping information
- Update order status
- Manage shipment progress


### 13. Seller Notifications 

When a buyer places an order, the relevant seller receives a notification.

The notification system keeps sellers informed about important activities related to their stores.

**Notification Features**

- **New Order Notification** – Sellers are automatically notified when a buyer places an order containing their products.
- **Notification Dashboard** – Sellers can view their notifications from a dedicated section.
- **Mark as Read** – Individual notifications can be marked as read.
- **Mark All as Read** – Sellers can mark all pending notifications as read at once.
- **Notification Status** – Notifications maintain their read/unread state.

### 14. Role-Based Dashboards

The application provides separate dashboards based on the authenticated user's role.

**Buyer Dashboard**

The Buyer Dashboard provides customers with access to their shopping and account information.

- **Profile** – Manage buyer account information.
- **Orders** – View previously placed orders.
- **Order Details** – View complete information for individual orders.
- **Cart** – Manage products selected for purchase.
- **Addresses** – Manage or select shipping information.
- **Notifications** – View relevant account/order notifications.
- **Account Information** – Manage personal account details.

**Seller Dashboard**

The Seller Dashboard provides sellers with tools to operate their ecommerce store.

- **Seller Profile** – Manage seller account information.
- **Store Management** – Create and manage store details.
- **Products** – Add, edit, delete, and manage products.
- **Inventory** – Monitor and update available stock.
- **Orders** – View and manage orders related to seller products.
- **Shipment Management** – Update order/shipment progress.
- **Notifications** – Receive and manage seller notifications.
- **Store Status** – Control the availability/status of the seller store.

**Admin Dashboard**

The Admin Dashboard provides centralized control over the ecommerce platform.

- **Dashboard Overview** – Provides a centralized view of platform activity.
- **User Management** – Manage registered buyers and user accounts.
- **Seller Management** – Manage seller accounts and seller information.
- **Store Management** – Monitor and manage seller stores.
- **Product Management** – Manage products across the platform.
- **Order Management** – Monitor customer orders and their status.
- **Shipment Monitoring** – Monitor order/shipment information across sellers.


### 15. Technology Stack

**Frontend**/

    React.js, Vite, JavaScript, Redux Toolkit, React Redux, React Router DOM, React Hook Form, Axios, Lucide React,Tailwind CSS / CSS

**Backend**

    Node.js, Express.js, MongoDB, REST API, JWT Authentication

**Third-Party Services**

    Razorpay – Payment Gateway, Cloudinary – Image Management, Resend – Email



### Installation required 

    npm create vite@latest
    npm install lucide-react
    npm install react-router-dom
    npm install dotenv
    npm i axios
    npm install @reduxjs/toolkit react-redux
    npm install cloudinary
    npm install react-hook-form
    npm install resend

