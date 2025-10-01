# Pagina de inicio 

Esta es una plantilla tipo inicio de windows 10
se crea por necesidad porque siempre estoy cambiando los navegadores
como tengo un servidor docker privado puedo visualizar mi HOME en todo lados.

# Actualizacion

Todavia estoy trabajando, espero terminarlo muy luego, no soy un experto 
programando pero creo que me salvo.

## Node
- la verdion de node es 24.8.0, si quieres hacer modificaciones directas y no usar Docker

- frontend 
```
npm install
nvp run dev
```

- backend
```
npm install
npm run dev
```

## Vhost
- se coloca en Vhost para que este apuntando el servidor Backend, ya viene configurado si se
usa en modo local, pero si lo usas con un dominio es recomendado modificar el Vhost
```
location /api/ {
  proxy_pass http://127.0.0.1:3001;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```
