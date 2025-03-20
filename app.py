from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Templates
templates = Jinja2Templates(directory=".")

# System prompt template

@app.post("/api/chat")
async def chat(request: Request):
    try:
        data = await request.json()
        user_message = data.get('message', '')
        SYSTEM_PROMPT = f"""Eres un asistente virtual especializado en proporcionar información sobre VR Distribución.
Debes seguir estas reglas estrictamente:

0. tu empresa es VR Distribución
1. SOLO responderás en español.
2. SOLO proporcionarás información relacionada con los servicios y productos de VR Distribución.
3. La información debe provenir ÚNICAMENTE de:
   - https://vrdistribucion.com
   - https://vrdistribucion.com/aparador/
   - https://vrdistribucion.com/maketingdigital/

4. Servicios principales sobre los que puedes informar:
   - Diseño de invitaciones y papelería
   - Centros de mesa y decoración
   - Marketing digital
   - Servicios de impresión
   - Diseño gráfico

5. Si te preguntan sobre algo fuera de estos temas, amablemente redirige la conversación hacia los servicios de VR Distribución.

6. Mantén un tono profesional pero amigable.


7. aqui esta el mesaje del usuario:
{user_message}





"""
        user_message = SYSTEM_PROMPT

        conversation_history = data.get('conversation_history', [])

        # Prepare messages for the API
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]

        # Add conversation history
        messages.extend(conversation_history)

        # Add the current user message
        messages.append({"role": "user", "content": user_message})

        # Make request to OpenRouter API
        response = requests.post(
            url='https://openrouter.ai/api/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {OPENROUTER_API_KEY}',
                'Content-Type': 'application/json',
                'HTTP-Referer': os.getenv('HTTP_REFERER', ''),
                'X-Title': os.getenv('X_TITLE', ''),
            },
            json={
                'model': 'meta-llama/llama-3.3-70b-instruct:free',
                'messages': messages,
                'max_tokens': 950,
                'temperature': 0.7,
                'stream': False
            }
        )

        if response.status_code != 200:
            print(f"OpenRouter API Error: {response.text}")
            return JSONResponse(
                status_code=response.status_code,
                content={"error": "Error from OpenRouter API"}
            )

        # Parse the response
        response_data = response.json()

        # Extract the assistant's message from the response
        assistant_message = response_data.get('choices', [{}])[0].get('message', {}).get('content', '')

        # Log the interaction for debugging
        print(f"User: {user_message}")
        print(f"Assistant: {assistant_message}")

        return JSONResponse(content={"response": assistant_message})

    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error"}
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)