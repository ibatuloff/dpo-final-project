from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
import io


def analyze_image(image: Image = None) -> dict:
    if image:
        pass
    return {
        "sentence": "This is a sample sentence"
    }


app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Server is running"}

@app.post('/api/analyze_image')
async def analyze_image_endpoint(file: UploadFile):
    """
    Эндпоинт для обработки изображений
    """
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid image format")
        
        content = await file.read()
        image = Image.open(io.BytesIO(content))
        result = analyze_image(image)

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))