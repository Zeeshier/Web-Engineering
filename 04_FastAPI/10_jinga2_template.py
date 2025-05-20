from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi import FastAPI, Request

app = FastAPI()

templates = Jinja2Templates(directory=r"Web-Engineering/01_HTML/01_html_basics")

@app.get("/hello/", response_class=HTMLResponse)
async def hello(request: Request):
    return templates.TemplateResponse("01_html_basics", {"request": request})
