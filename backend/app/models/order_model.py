from bson.objectid import ObjectId
from app.db_client import db   # Adjust import based on your project structure

class OrderModel:

    @staticmethod
    def create_order(data):
        return db.order.insert_one(data)

    @staticmethod
    def get_all_orders():
        return list(db.order.find())

    @staticmethod
    def get_order_by_id(order_id):
        return db.order.find_one({'_id': ObjectId(order_id)})

    @staticmethod
    def update_order(order_id, data):
        return db.order.update_one({'_id': ObjectId(order_id)}, {'$set': data})

    @staticmethod
    def delete_order(order_id):
        return db.order.delete_one({'_id': ObjectId(order_id)})
