import uuid
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

# =====================
# CLAVE DE OPENAI
# =====================
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
X_TOKEN = os.getenv("X_TOKEN")
if not OPENAI_API_KEY:
    raise ValueError("La variable de entorno OPENAI_API_KEY no está configurada.")

MARKETING_API_URL= "https://dannybombastic.app.n8n.cloud/webhook/7048eeb4-986e-4ff2-bc1c-013222bc477f"

VRDITRIBUCION_API_URL= "https://dannybombastic.app.n8n.cloud/webhook/7048eeb4-986e-4ff2-bc1c-013222bc477f"

# URL del webhook de N8N para cotizaciones
COTIZACIONES_API_URL = "https://dannybombastic.app.n8n.cloud/webhook/9057a53d-bf82-469a-a534-f27b39adb9a32"

# URL del webhook de N8N para formulario de contacto
CONTACT_API_URL = "https://dannybombastic.app.n8n.cloud/webhook/9057a53d-bf82-469a-a534-f27b39adb9a2"

# =====================
# CLAVE DE OPENROUTER


HTTP_REFERRER = "https://vrdistribucion.com"
X_TITLE = "VR Distribución Asistente IA"
MODEL = "gpt-3.5-turbo" # Puedes cambiar el modelo aquí

app = FastAPI()

# Ambiente y configuración de CORS
if os.getenv('ENV') == 'production':
    print("production environment")
    cors_origins = [
        "https://vrdistribucion.com",
        "https://www.vrdistribucion.com",
        "https://dannybombastic.app.n8n.cloud",

    ]
else:
    print("development environment")
    cors_origins = [
        "http://127.0.0.1:5501",
        "http://127.0.0.1:8000",
        "http://localhost:8000",
        "https://vrdistribucion.com",
        "https://www.vrdistribucion.com",
        "https://dannybombastic.app.n8n.cloud",
        "*"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

templates = Jinja2Templates(directory=".")

# =====================
# PROMPTS
# =====================
SYSTEM_PROMPT = """Eres un asistente virtual especializado en proporcionar información sobre VR Distribución. Sigue estas reglas estrictamente:
1. Tu empresa es vrdistribucion.com RESPONDE USANDO MARKDOWN.
2. Responde únicamente en español.
3. No uses markdown en tus respuestas.
4. Proporciona siempre los enlaces de nuestro sitio web utilizando la etiqueta <a href="url_ejemplo" target="_blank">.
5. La información que brindes debe estar relacionada con los servicios y productos de VR Distribución.
3. Usa internet para obtener la información. La información debe provenir ÚNICAMENTE de:
   - https://vrdistribucion.com # sitio principal
   - https://vrdistribucion.com/webdesigncancun/ # diseño web en cancún, marketing digital y agentes IA
   - https://g.co/kgs/2AydBGG  # horarios, teléfonos y direcciones
   - https://www.facebook.com/share/15oBN2xkPS/?mibextid=wwXIfr  # redes sociales usa este icono <iclass="icon ion-logo-facebook"></i></a>
   - https://www.instagram.com/vrcancunonline?igsh=MTFrcjdybGsyNzV4aw==  # redes sociales usa estos iconos <iclass="icon ion-logo-instagram"></i></a>
   - VR DISTRIBUCION
   - Dirección: Lat. Av. Tulum Supermanzana 2, Bancos, 77500 Cancún, Q.R., México
   - Teléfono: +52 998 236 1177
   - Horario:
        sábado	11:00–18:00
        domingo	Cerrado
        lunes	11:00–18:00
        martes	11:00–18:00
        miércoles  11:00–18:00
        jueves	11:00–18:00
        viernes	11:00–18:00
7. Servicios principales sobre los que puedes informar:
   - Diseño de invitaciones y papelería
   - Centros de mesa y decoración
   - Marketing digital
   - Servicios de impresión
   - Diseño gráfico
8. Si te preguntan sobre temas que no estén dentro de estos servicios, redirige amablemente la conversación hacia las ofertas de VR Distribución.
9. Mantén un tono profesional pero amigable.
10. Mantén tus mensajes cortos y directos.
11. RESPONDE USANDO MARKDOWN.
"""

AGENT_SYSTEM_PROMPT = """Eres un asistente virtual especializado en proporcionar información sobre VR Distribución. Debes seguir estas reglas estrictamente:

0. Tu empresa es VR Distribución RESPONDE USANDO MARKDOWN.
1. Responde únicamente en español.
2. Proporciona información exclusivamente relacionada con los servicios y productos de VR Distribución.
3. Usa internet para obtener la información. La información debe provenir ÚNICAMENTE de:
   - https://vrdistribucion.com # sitio principal
   - https://vrdistribucion.com/webdesigncancun/ # diseño web en cancún, marketing digital y agentes IA
   - https://g.co/kgs/2AydBGG  # horarios, teléfonos y direcciones
   - https://www.facebook.com/share/15oBN2xkPS/?mibextid=wwXIfr  # redes sociales usa este icono <iclass="icon ion-logo-facebook"></i></a>
   - https://www.instagram.com/vrcancunonline?igsh=MTFrcjdybGsyNzV4aw==  # redes sociales usa estos iconos <iclass="icon ion-logo-instagram"></i></a>
   - VR DISTRIBUCION
   - Dirección: Lat. Av. Tulum Supermanzana 2, Bancos, 77500 Cancún, Q.R., México
   - Teléfono: +52 998 236 1177
   - Horario:
        sábado	11:00–18:00
        domingo	Cerrado
        lunes	11:00–18:00
        martes	11:00–18:00
        miércoles	11:00–18:00
        jueves	11:00–18:00
        viernes	11:00–18:00


4. Principales servicios sobre los que puedes informar (con énfasis en marketing digital, web y agentes IA):
   - Marketing digital (estrategias, consultoría, campañas publicitarias, etc.)
   - Diseño web (sitios web, optimización, SEO)
   - Manejo de redes sociales
   - Branding y diseño gráfico
   - Publicidad y contenido
   - Agentes IA (soluciones conversacionales, automatización, etc.)

5. Si se pregunta sobre algo fuera de estos temas, redirige amablemente la conversación a los servicios de VR Distribución relacionados con marketing digital, diseño web o agentes IA.
6. Mantén un tono profesional pero amigable.
7. Mantén tus mensajes cortos y directos.
8. Proporciona siempre los enlaces utilizando la etiqueta HTML <a>.
9. RESPONDE USANDO MARKDOWN.
"""


# =====================
# ENDPOINTS OpenRouter
# =====================

@app.post("/api/chat")
async def chat(request: Request):
    try:
        data = await request.json()
        user_message = data.get('message', '').strip()
        uuid = data.get('sessionId', '').strip()
        timestamp = data.get('timestamp', '').strip()

        if not user_message:
            return JSONResponse(
                status_code=400,
                content={"error": "El mensaje no puede estar vacío"}
            )

        try:
            response = requests.post(
                url=VRDITRIBUCION_API_URL,
                headers={
                    "Authorization": f"Bearer {X_TOKEN}",
                    'Content-Type': 'application/json',
                    'X-Token': X_TOKEN
                },
                json={
                    'chatInput': user_message,
                    'max_tokens': 950,
                    'temperature': 0.7,
                    'stream': False,
                    "sessionId": uuid,
                    "timestamp": timestamp
                },
                timeout=30
            )
            response.raise_for_status()

            response_data = response.json()
            assistant_message = response_data.get('output', '')
            if not assistant_message:
                raise ValueError("No response generated by the API")

            print(f"User: {user_message}")
            print(f"Assistant: {assistant_message}")

            return JSONResponse(content={"response": assistant_message})

        except requests.exceptions.Timeout:
            return JSONResponse(
                status_code=504,
                content={"error": "La solicitud ha excedido el tiempo de espera"}
            )
        except requests.exceptions.RequestException as e:
            return JSONResponse(
                status_code=502,
                content={"error": f"Error al comunicarse con el servicio: {str(e)}"}
            )
        except ValueError as e:
            return JSONResponse(
                status_code=500,
                content={"error": str(e)}
            )

    except json.JSONDecodeError:
        return JSONResponse(
            status_code=400,
            content={"error": "Formato de solicitud inválido"}
        )
    except Exception as e:
        print(f"Error inesperado: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": "Error interno del servidor"}
        )


@app.post("/api/marketing/chat")
async def chat_ia(request: Request):
    try:
        data = await request.json()
        user_message = data.get('message', '').strip()
        uuid = data.get('sessionId', '').strip()
        timestamp = data.get('timestamp', '').strip()
        if not user_message:
            return JSONResponse(
                status_code=400,
                content={"error": "El mensaje no puede estar vacío"}
            )
        try:
            response = requests.post(
                url=MARKETING_API_URL,
                headers={
                    "Authorization": f"Bearer {X_TOKEN}",
                    'Content-Type': 'application/json',
                    'X-Token': X_TOKEN
                },
                json={
                    'chatInput': user_message,
                    'max_tokens': 950,
                    'temperature': 0.7,
                    'stream': False,
                    "sessionId": uuid,
                    "timestamp": timestamp
                },
                timeout=30
            )
            response.raise_for_status()

            response_data = response.json()
            assistant_message = response_data.get('output', '')
            if not assistant_message:
                raise ValueError("No response generated by el API")

            print(f"User: {user_message}")
            print(f"Assistant: {assistant_message}")

            return JSONResponse(content={"response": assistant_message})

        except requests.exceptions.Timeout:
            return JSONResponse(
                status_code=504,
                content={"error": "La solicitud ha excedido el tiempo de espera"}
            )
        except requests.exceptions.RequestException as e:
            return JSONResponse(
                status_code=502,
                content={"error": f"Error al comunicarse con el servicio: {str(e)}"}
            )
        except ValueError as e:
            return JSONResponse(
                status_code=500,
                content={"error": str(e)}
            )

    except json.JSONDecodeError:
        return JSONResponse(
            status_code=400,
            content={"error": "Formato de solicitud inválido"}
        )
    except Exception as e:
        print(f"Error inesperado: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": "Error interno del servidor"}
        )

# ============================
# ENDPOINTS OpenAI Oficiales
# ============================

# IMPORTANTE: Estos endpoints usan la API de OpenAI en https://api.openai.com/v1/chat/completions
# Debes tener tu propia API_KEY y un modelo válido (p. ej.: "gpt-3.5-turbo")

OPENAI_MODEL = "gpt-3.5-turbo"  # Puedes cambiar el modelo aquí

@app.post("/api/chat/openai")
async def chat_openai(request: Request):
    try:
        data = await request.json()
        user_message = data.get('message', '').strip()
        if not user_message:
            return JSONResponse(
                status_code=400,
                content={"error": "El mensaje no puede estar vacío"}
            )

        conversation_history = data.get('conversation_history', [])

        # Construimos los mensajes
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]
        if conversation_history:
            messages.extend(conversation_history)
        messages.append({"role": "user", "content": user_message})

        try:
            # Llamada a la API oficial de OpenAI
            response = requests.post(
                url="https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": OPENAI_MODEL,
                    "messages": messages,
                    "max_tokens": 950,
                    "temperature": 0.7,
                    "stream": False
                },
                timeout=30
            )
            response.raise_for_status()

            response_data = response.json()
            assistant_message = response_data.get('choices', [{}])[0].get('message', {}).get('content', '')
            if not assistant_message:
                raise ValueError("No se recibió respuesta de la API de OpenAI")

            print(f"User: {user_message}")
            print(f"Assistant (OpenAI): {assistant_message}")

            return JSONResponse(content={"response": assistant_message})

        except requests.exceptions.Timeout:
            return JSONResponse(
                status_code=504,
                content={"error": "La solicitud a OpenAI ha excedido el tiempo de espera"}
            )
        except requests.exceptions.RequestException as e:
            return JSONResponse(
                status_code=502,
                content={"error": f"Error al comunicarse con OpenAI: {str(e)}"}
            )
        except ValueError as e:
            return JSONResponse(
                status_code=500,
                content={"error": str(e)}
            )

    except json.JSONDecodeError:
        return JSONResponse(
            status_code=400,
            content={"error": "Formato de solicitud inválido"}
        )
    except Exception as e:
        print(f"Error inesperado en /api/chat/openai: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": "Error interno del servidor"}
        )


@app.post("/api/marketing/chat/openai")
async def chat_ia_openai(request: Request):
    try:
        data = await request.json()
        user_message = data.get('message', '').strip()
        if not user_message:
            return JSONResponse(
                status_code=400,
                content={"error": "El mensaje no puede estar vacío"}
            )

        conversation_history = data.get('conversation_history', [])

        # Construimos los mensajes
        messages = [
            {"role": "system", "content": AGENT_SYSTEM_PROMPT}
        ]
        if conversation_history:
            messages.extend(conversation_history)
        messages.append({"role": "user", "content": user_message})

        try:
            # Llamada a la API oficial de OpenAI
            response = requests.post(
                url="https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": OPENAI_MODEL,
                    "messages": messages,
                    "max_tokens": 950,
                    "temperature": 0.7,
                    "stream": False
                },
                timeout=30
            )
            response.raise_for_status()

            response_data = response.json()
            assistant_message = response_data.get('choices', [{}])[0].get('message', {}).get('content', '')
            if not assistant_message:
                raise ValueError("No se recibió respuesta de la API de OpenAI")

            print(f"User: {user_message}")
            print(f"Assistant (OpenAI): {assistant_message}")
            conversation_history.append({"role": "assistant", "content": assistant_message})
            return JSONResponse(content={"response": assistant_message})

        except requests.exceptions.Timeout:
            return JSONResponse(
                status_code=504,
                content={"error": "La solicitud a OpenAI ha excedido el tiempo de espera"}
            )
        except requests.exceptions.RequestException as e:
            return JSONResponse(
                status_code=502,
                content={"error": f"Error al comunicarse con OpenAI: {str(e)}"}
            )
        except ValueError as e:
            return JSONResponse(
                status_code=500,
                content={"error": str(e)}
            )

    except json.JSONDecodeError:
        return JSONResponse(
            status_code=400,
            content={"error": "Formato de solicitud inválido"}
        )
    except Exception as e:
        print(f"Error inesperado en /api/marketing/chat/openai: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": "Error interno del servidor"}
        )


# ============================
# ENDPOINT PARA COTIZACIONES
# ============================

@app.post("/api/cotizaciones")
async def submit_cotizacion(request: Request):
    """
    Endpoint para recibir solicitudes de cotización desde el frontend
    y reenviarlas al webhook de N8N de forma segura
    """
    try:
        # Obtener los datos del formulario
        data = await request.json()
        
        # Validaciones básicas
        if not data.get('nombre') or not data.get('email') or not data.get('telefono'):
            return JSONResponse(
                status_code=400,
                content={"error": "Faltan campos obligatorios (nombre, email, teléfono)"}
            )
        
        # Agregar metadatos de seguridad
        data['source'] = 'vrdistribucion.com'
        data['ip_address'] = request.client.host if request.client else 'unknown'
        data['user_agent'] = request.headers.get('user-agent', 'unknown')
        data['submission_time'] = data.get('timestamp', '')
        
        print(f"Recibida cotización de: {data.get('nombre')} - {data.get('email')}")
        
        try:
            # Reenviar a N8N con el token seguro
            response = requests.post(
                url=COTIZACIONES_API_URL,
                headers={
                    "Authorization": f"Bearer {X_TOKEN}",
                    "Content-Type": "application/json",
                    "X-TOKEN": X_TOKEN
                },
                json=data,
                timeout=30
            )
            response.raise_for_status()
            
            # Intentar obtener la respuesta de N8N
            try:
                response_data = response.json()
            except json.JSONDecodeError:
                # Si N8N no devuelve JSON válido, crear respuesta por defecto
                response_data = {
                    "status": "success",
                    "message": "Cotización recibida correctamente"
                }
            
            print(f"Cotización enviada exitosamente a N8N para: {data.get('nombre')}")
            
            return JSONResponse(content=response_data)
            
        except requests.exceptions.Timeout:
            print("Timeout al enviar cotización a N8N")
            return JSONResponse(
                status_code=504,
                content={"error": "La solicitud tardó demasiado tiempo. Por favor intenta de nuevo."}
            )
        except requests.exceptions.RequestException as e:
            print(f"Error al comunicarse con N8N: {str(e)}")
            return JSONResponse(
                status_code=502,
                content={"error": "Error al procesar la solicitud. Por favor intenta de nuevo."}
            )
            
    except json.JSONDecodeError:
        return JSONResponse(
            status_code=400,
            content={"error": "Formato de datos inválido"}
        )
    except Exception as e:
        print(f"Error inesperado en /api/cotizaciones: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": "Error interno del servidor"}
        )


# ============================
# ENDPOINT PARA FORMULARIO DE CONTACTO
# ============================

@app.post("/api/contact")
async def submit_contact(request: Request):
    """
    Endpoint para recibir mensajes del formulario de contacto
    y reenviarlos al webhook de N8N de forma segura
    """
    try:
        # Obtener los datos del formulario
        data = await request.json()
        
        # Validaciones básicas
        if not data.get('name') or not data.get('email') or not data.get('message'):
            return JSONResponse(
                status_code=400,
                content={"error": "Nombre, email y mensaje son campos obligatorios"}
            )
        
        # Agregar metadatos de seguridad
        contact_data = {
            'name': data.get('name'),
            'email': data.get('email'),
            'phone': data.get('phone', ''),  # Campo opcional
            'message': data.get('message'),
            'source': 'vrdistribucion.com - Formulario de Contacto',
            'ip_address': request.client.host if request.client else 'unknown',
            'user_agent': request.headers.get('user-agent', 'unknown'),
            'submission_time': data.get('timestamp', ''),
            'form_type': 'contact'
        }
        
        print(f"Recibido mensaje de contacto de: {contact_data.get('name')} - {contact_data.get('email')}")
        
        try:
            # Enviar datos a N8N
            response = requests.post(
                url=CONTACT_API_URL,
                headers={
                    "Content-Type": "application/json",
                    "X-Token": X_TOKEN
                },
                json=contact_data,
                timeout=30
            )
            response.raise_for_status()
            
            return JSONResponse(
                status_code=200,
                content={
                    "success": True,
                    "message": "Tu mensaje ha sido enviado correctamente. Te contactaremos pronto."
                }
            )
            
        except requests.exceptions.Timeout:
            return JSONResponse(
                status_code=504,
                content={"error": "El servidor tardó demasiado en responder. Intenta nuevamente."}
            )
        except requests.exceptions.RequestException as e:
            print(f"Error al enviar a N8N: {str(e)}")
            return JSONResponse(
                status_code=502,
                content={"error": "Error al procesar tu solicitud. Intenta nuevamente."}
            )
            
    except json.JSONDecodeError:
        return JSONResponse(
            status_code=400,
            content={"error": "Formato de datos inválido"}
        )
    except Exception as e:
        print(f"Error inesperado en /api/contact: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": "Error interno del servidor"}
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
