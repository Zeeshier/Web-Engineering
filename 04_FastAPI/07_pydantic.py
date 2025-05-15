from typing import List
from pydantic import BaseModel

class Student(BaseModel):
 id: int
 name :str
 subjects: List[str] = []

data = {
 'id': 1,
 'name': "Zeeshan Ahmad",
 'subjects': ["Eng", "Maths", "Sci"],
}
s1 =Student(**data)
print(s1)

