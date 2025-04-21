from fastapi import FastAPI, UploadFile, HTTPException
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import torch
import io
import random
from transformers import AutoTokenizer, AutoModelForCausalLM
from transformers import MarianMTModel, MarianTokenizer

import os
from dotenv import load_dotenv
from huggingface_hub import login

load_dotenv()
token = os.getenv("HUGGINGFACE_TOKEN")  # для доступа к моделям Gemma необходима авторизация
login(token=token)

english_rule_topics = [
    "Pronouns",
    "Personal pronouns",
    "Personal pronouns in the narrow sense",
    "Personal pronouns in the broad sense",
    "Other classes of pronouns",
    "Articles",
    "Indefinite article",
    "Definite article",
    "Zero article",
    "Nouns",
    "Number",
    "Gender",
    "Possessive form (possessive)",
    "Adjectives",
    "Degrees of comparison",
    "Adverbs",
    "Numerals",
    "Cartential",
    "Ordinal",
    "Verbs",
    "Classification",
    "Basic forms",
    "Aspect-tense forms",
    "Future tense",
    "Future in the past and conditional mood",
    "Imperative mood",
    "Subjunctive mood",
    "Passive voice",
    "Examples conjugations",
    "Auxiliary verbs",
    "Linking verb",
    "Auxiliary verb to do",
    "Auxiliary verb to have",
    "Modal verbs",
    "Phrasical verbs",
    "Prepositions and postpositions",
    "Syntax",
    "Phrase structure",
    "Impersonal sentences",
    "Existential sentences",
    "Complex subject",
    "Complex sentences (CS)",
    "Indirect speech and tense agreement"
]

print("Starting loading BLIP model")
blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
print("BLIP model downloaded")


def get_image_keywords(image: Image) -> dict:
    """Анализирует предложение и возвращает его текстовое описание"""
    device = "cuda" if torch.cuda.is_available() else "cpu"
    blip_model.to(device)

    inputs = blip_processor(images=image, return_tensors="pt").to(device)
    out = blip_model.generate(**inputs, max_new_tokens=30)
    caption = blip_processor.decode(out[0], skip_special_tokens=True)
    return {"keywords": caption}


print("Starting loading LLM model")

llm_tokenizer = AutoTokenizer.from_pretrained("google/gemma-2b-it")
llm = AutoModelForCausalLM.from_pretrained(
    "google/gemma-2b-it",
    device_map="auto",
)

print("LLM downloaded")

print("Starting loading translate model")

translate_model_name = "Helsinki-NLP/opus-mt-en-ru"
translate_tokenizer = MarianTokenizer.from_pretrained(translate_model_name)
translate_model = MarianMTModel.from_pretrained(translate_model_name)

print("translate model downloaded")

input_text = "Generate 1 sentence in English using grammar on the topic '{}' " \
             "using words from the sentence '{}'. The answer must contains 1 sentence ONLY. " \
             "The sentence must include words from the given sentence and must use the rules on the given topic. " \
             "The answer must NOT contain any other."

input_text_for_translate = "Translate this text into Russian language. {} There" \
                           " should be nothing superfluous in the answer. " \
                           "The answer should contain ONLY THE TRANSLATION."


def get_formated_prompt(image_description: str) -> str:
    rule_name = random.choice(english_rule_topics)
    return input_text.format(rule_name, image_description)


def run_llm(input_text: str) -> str:
    last_prompt_sentence = input_text.split(".")[-2]
    input_ids = llm_tokenizer(input_text, return_tensors="pt").to("cuda")
    outputs = llm.generate(**input_ids, max_length=1000)
    llm_output_text = \
        llm_tokenizer.decode(outputs[0], skip_special_tokens=True).split(last_prompt_sentence)[
            -1].split("\n\n")[-1]
    return llm_output_text


def generate_english_sentence(image_description: str) -> str:
    input_text = get_formated_prompt(image_description)
    llm_output_text = run_llm(input_text)
    return llm_output_text


def generate_translation(text: str) -> str:
    inputs = translate_tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    translated = translate_model.generate(**inputs)
    return translate_tokenizer.decode(translated[0], skip_special_tokens=True)


def analyze_image(image: Image = None) -> dict:
    """Генерирует предложение на основе изображения"""
    if image:
        image_description = get_image_keywords(image)["keywords"]
        english_sentence = generate_english_sentence(image_description)
        tranleted_sentence = generate_translation(english_sentence)

        return {
            "sentence": english_sentence,
            "translate": tranleted_sentence
        }
    else:
        raise ValueError('No image to analyze')


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
        if file.content_type is None:
            raise HTTPException(status_code=400, detail="Invalid request format")
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid image format")

        content = await file.read()
        image = Image.open(io.BytesIO(content))
        result = analyze_image(image)

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))