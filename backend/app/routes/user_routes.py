from bson.objectid import ObjectId

from ..models.product_model import ProductModel
from ..models.order_model import OrderModel

def list_products():
    products = ProductModel.get_all_products()
    available_products = [p for p in products if p.get('is_available', True)]
    for product in available_products:
        product['_id'] = str(product['_id'])
    return available_products

def product_detail(product_id):
    product = ProductModel.get_product_by_id(product_id)
    if not product or not product.get('is_available', True):
        return 404, {"error": "Product not available"}
    product['_id'] = str(product['_id'])
    return 200, product

def create_order_user(data):
    # Create order as before
    res = OrderModel.create_order(data)

    # Support both single product and multiple items
    items = data.get("items")
    if items and isinstance(items, list):
        for item in items:
            product_id = item.get("product_id")
            quantity = int(item.get("quantity", 0))
            if product_id and quantity > 0:
                product = ProductModel.get_product_by_id(product_id)
                if product:
                    new_stock = max(product.get("stock_quantity", 0) - quantity, 0)
                    ProductModel.update_product(product_id, {"stock_quantity": new_stock})
    else:
        # For legacy requests with product_id/quantity at top level
        product_id = data.get("product_id")
        quantity = int(data.get("quantity", 0))
        if product_id and quantity > 0:
            product = ProductModel.get_product_by_id(product_id)
            if product:
                new_stock = max(product.get("stock_quantity", 0) - quantity, 0)
                ProductModel.update_product(product_id, {"stock_quantity": new_stock})

    return {"message": "Order placed", "id": str(res.inserted_id)}
