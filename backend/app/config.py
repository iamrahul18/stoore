import os

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://rahul:rahul123@store.nupvdv0.mongodb.net/store?retryWrites=true&w=majority&appName=Store")
