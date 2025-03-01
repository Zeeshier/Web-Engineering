from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime
import os

# Initialize FastAPI app
app = FastAPI(title="Todo")

# Add CORS middleware to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a directory for static files if it doesn't exist
os.makedirs("static", exist_ok=True)

# Mount the static directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Todo model
class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    
class Todo(TodoCreate):
    id: str
    completed: bool
    created_at: datetime
    
todos_db = []

# Serve the index.html file
@app.get("/")
async def get_index():
   return FileResponse(os.path.join("static", "index.html"))  

@app.get("/api", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the Todo APP"}

@app.get("/todos", response_model=List[Todo], tags=["Todos"])
async def get_todos():
    return todos_db

@app.post("/todos", response_model=Todo, tags=["Todos"])
async def create_todo(todo: TodoCreate):
    new_todo = Todo(
        id=str(uuid.uuid4()),
        completed=False,
        created_at=datetime.now(),
        **todo.dict()
    )
    todos_db.append(new_todo)
    return new_todo

@app.get("/todos/{todo_id}", response_model=Todo, tags=["Todos"])
async def get_todo(todo_id: str):
    for todo in todos_db:
        if todo.id == todo_id:
            return todo
    raise HTTPException(status_code=404, detail="Todo not found")

@app.put("/todos/{todo_id}", response_model=Todo, tags=["Todos"])
async def update_todo(todo_id: str, todo_data: TodoCreate):
    for i, todo in enumerate(todos_db):
        if todo.id == todo_id:
            todos_db[i] = Todo(
                id=todo.id,
                completed=todo.completed,
                created_at=todo.created_at,
                **todo_data.dict()
            )
            return todos_db[i]
    raise HTTPException(status_code=404, detail="Todo not found")

@app.put("/todos/{todo_id}/toggle", response_model=Todo, tags=["Todos"])
async def toggle_todo(todo_id: str):
    for i, todo in enumerate(todos_db):
        if todo.id == todo_id:
            todos_db[i].completed = not todos_db[i].completed
            return todos_db[i]
    raise HTTPException(status_code=404, detail="Todo not found")

@app.delete("/todos/{todo_id}", tags=["Todos"])
async def delete_todo(todo_id: str):
    for i, todo in enumerate(todos_db):
        if todo.id == todo_id:
            deleted_todo = todos_db.pop(i)
            return {"message": f"Todo '{deleted_todo.title}' deleted successfully"}
    raise HTTPException(status_code=404, detail="Todo not found")

# Run with: uvicorn main:app --reload