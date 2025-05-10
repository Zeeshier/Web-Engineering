import uvicorn
from fastapi import FastAPI
app = FastAPI()

@app.get("/")
async def index():  
 return {"message": "Hello World"}

@app.get("/hello/{name}/{age}")
async def hello(name,age):# -> dict[str, Any]:
 return {"name": name, "age":age}