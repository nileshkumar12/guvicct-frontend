
## Ecommerce Website




## Installation required 

        npm create vite@latest
        npm install lucide-react
        npm install react-router-dom
        npm install dotenv
        npm i axios
        npm install @reduxjs/toolkit react-redux
        npm install cloudinary
        npm install react-hook-form
        npm install nodemailer
        npm install resend



# 🛒 Ecommerce Website – Features 
## 1. User & Authentication
       # Buyer
            User registration
            User login/logout
            Authentication using JWT
            Protected routes
            User profile
            User role handling
            Buyer-specific pages
            Login redirect when trying to checkout/place order
        # Seller
            Seller role
            Seller profile
            Seller store management
            Seller-specific dashboard
            Seller-specific products
            Seller-specific orders
            Seller notifications
            Shipment management
        # Admin
            Admin role
            Admin profile
            Admin dashboard
            Product management
            Store management
            User management
           
            Order/shipment management
## 2. Seller Store Management

        # Seller can create/manage their store.

            Store information
            Store Name
            Slug
            Logo
            Banner
            Category
            Description
            Phone
            Email
            Address
            GST Number
            PAN Number
            Opening Time
            Closing Time
            Status

        # Store is associated with the seller/owner.

            You also added the store reference to the Product model so products belong to a specific store.

# 3. Product Management
        # Seller/Admin can:
            Add product
            Edit product
            Delete product
            Upload product image
            Manage product price
            Manage stock
            Manage category
            Manage product description
            Assign product to store

        You also discussed proper handling of deleted product images/details.

# 4. Product Listing

        # Buyer can:

            View products
            View product details
            Browse products
            View product image
            View price
            View stock
            View product category
            View product reviews
            Add products to cart

# 5. Product Reviews

            Product reviews
            Review submission
            Review validation
            Review API
            Restriction that a buyer should be able to review only after receiving the product


# 6. Shopping Cart 🛒

        # Cart functionality includes:

            Add product to cart
            Increase quantity
            Decrease quantity
            Remove product
            Product quantity
            Product price
            Stock handling
            Cart persistence
            User-specific cart


# 7. Checkout

        # Checkout includes:

            Cart summary
            Product subtotal
            Discount
            Shipping charge
            Final total
            Shipping address
            Buyer information
            Order placement


# 9. Order Management 📦

        Order creation is implemented around a unique human-readable order number.
        Dynamic Order Number
        Email trigger to the user and notify to seller

        Example:

        ORD-20260813-103870

        # Order data includes:

            Order Number
            Buyer
            Products
            Quantity
            Price
            Shipping Address
            Subtotal
            Discount
            Shipping
            Total
            Status`


# 11. Buyer Order History

        # Buyer can view:
 
            Order number
            Ordered products
            Quantity
            Price
            Shipping
            Discount
            Total
            Shipping address
            Order status
            Order details

# 12. Seller Order Management

            Seller can see orders related to their products.

# 13. Seller Notifications 🔔

  when buyer user placed order then seller notified automatically in notification section and there can manage the status like "Marked Read/ Mark All Read"

# 14. Dashboad 

    Dashboard for buyer, seller, admin
