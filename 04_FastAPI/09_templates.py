from fastapi.responses import HTMLResponse
from fastapi import FastAPI
app = FastAPI()
@app.get("/hello/")
async def hello():
 ret='''
 <html>
 <body>
 <h2>Hello World!</h2>
 <p> my name is zeeshan</p>
 </body>
 </html>
   '''
 return HTMLResponse(content=ret)