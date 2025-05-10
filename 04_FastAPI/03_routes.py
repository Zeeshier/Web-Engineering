from fastapi import FastAPI, HTTPException
from typing import Optional
from pydantic import BaseModel

app = FastAPI()

# Grocery list dictionary to store items
grocery_list: dict[int, "ItemPayLoad"] = {}

# Pydantic model for item payload
class ItemPayLoad(BaseModel):
    item_id: Optional[int]
    item_name: str
    quantity: int

# Route to add an item
@app.post("/items/{item_name}/{quantity}")
def add_item(item_name: str, quantity: int):
    if quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than 0.")
    
    # Get existing item names and their IDs
    items_ids = {
        item.item_name: item.item_id if item.item_id is not None else 0 
        for item in grocery_list.values()
    }

    # If item already exists, add to its quantity
    if item_name in items_ids:
        item_id = items_ids[item_name]
        grocery_list[item_id].quantity += quantity
    else:
        # Create a new item with a new ID
        item_id = max(grocery_list.keys(), default=-1) + 1
        grocery_list[item_id] = ItemPayLoad(
            item_id=item_id, 
            item_name=item_name, 
            quantity=quantity
        )

    return {"item": grocery_list[item_id]}
