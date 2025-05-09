from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def index():
 return {"message": "Hello World"}

# uvicorn 01_helloworld:app --reload