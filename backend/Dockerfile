FROM python:3.10-alpine

WORKDIR /usr/src/app

COPY . .

RUN pip install --upgrade pip && pip install -r requirements.txt

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]