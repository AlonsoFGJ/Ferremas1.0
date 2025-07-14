# Ferremas1.0

Instrucciones para iniciar la pagina de forma local:
1- En la terminal, ejecutar el comando "npm install"

2- Iniciar APIs (fastapi_pedido, fastapi_producto, fastapi_final.
                  Iniciar estas APIs, dentro de un terminal GitBash, con el comando:
                  "python -m uvicorn app.main:app --reload --port ...")
                  
2.2- Las APIs deben iniciar en los siguientes port:
     
  - fastapi_pedido: 8002
     
  - fastapi_producto: 8000
     
  - fastapi_final (usuarios): 8001

PD: En "api_carrito" no necesita definir el puerto pero debe ser iniciada con el comando: "node index.js"
        
3.- Iniciar "Ferremas1.0" en una terminal CMD con el comando:
    - ionic serve


4.- Para realizar pruebas de la pasarela de pago, la cuenta de ejemplo es:

  Email: sb-cvd7w42976779@personal.example.com
    
  Contraseña: WW3loCy?
