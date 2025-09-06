from bson.objectid import ObjectId
from ..models.product_model import ProductModel
from ..models.order_model import OrderModel

def get_all_products():
    products = ProductModel.get_all_products()
    for product in products:
        product['_id'] = str(product['_id'])
    return products

def create_product(data):
    res = ProductModel.create_product(data)
    # Fetch the newly inserted product document to return full data
    product = ProductModel.get_product_by_id(res.inserted_id)
    product['_id'] = str(product['_id'])
    return product

def get_product_by_id(product_id):
    product = ProductModel.get_product_by_id(product_id)
    if not product:
        return 404, {"error": "Product not found"}
    product['_id'] = str(product['_id'])
    return 200, product

def update_product(product_id, data):
    res = ProductModel.update_product(product_id, data)
    if res.modified_count == 0:
        return 404, {"error": "No changes made or product not found"}
    return 200, {"message": "Product updated"}

def delete_product(product_id):
    res = ProductModel.delete_product(product_id)
    if res.deleted_count == 0:
        return 404, {"error": "Product not found"}
    return 200, {"message": "Product deleted"}

# Orders

def get_all_orders():
    orders = OrderModel.get_all_orders()
    for order in orders:
        order['_id'] = str(order['_id'])
    return orders

def get_order_by_id(order_id):
    order = OrderModel.get_order_by_id(order_id)
    if not order:
        return 404, {"error": "Order not found"}
    order['_id'] = str(order['_id'])
    return 200, order

def update_order(order_id, data):
    res = OrderModel.update_order(order_id, data)
    if res.modified_count == 0:
        return 404, {"error": "No changes made or order not found"}
    return 200, {"message": "Order updated"}

def delete_order(order_id):
    res = OrderModel.delete_order(order_id)
    if res.deleted_count == 0:
        return 404, {"error": "Order not found"}
    return 200, {"message": "Order deleted"}
