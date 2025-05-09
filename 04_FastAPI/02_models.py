from typing import Optional
from pydantic import BaseModel

class ItemPayLoad(BaseModel):
    item_id: Optional[int]
    item_name: str
    quantity: int

if __name__ == "__main__":
    item = ItemPayLoad(item_id=1, item_name="item1", quantity=10)
    print(item)
    print(item.item_id)
    print(item.item_name)
    print(item.quantity)

