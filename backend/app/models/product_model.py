from bson.objectid import ObjectId
from app.db_client import db

class ProductModel:

    @staticmethod
    def create_product(data):
        return db.products.insert_one(data)

    @staticmethod
    def get_all_products():
        return list(db.products.find())

    @staticmethod
    def get_product_by_id(product_id):
        return db.products.find_one({'_id': ObjectId(product_id)})

    @staticmethod
    def update_product(product_id, data):
        return db.products.update_one({'_id': ObjectId(product_id)}, {'$set': data})

    @staticmethod
    def delete_product(product_id):
        return db.products.delete_one({'_id': ObjectId(product_id)})
