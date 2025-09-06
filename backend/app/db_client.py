from pymongo import MongoClient

MONGO_URI = "mongodb+srv://rahul:rahul123@store.nupvdv0.mongodb.net/store?retryWrites=true&w=majority&appName=Store"

client = MongoClient(MONGO_URI)
db = client.store  # Use your actual DB name
