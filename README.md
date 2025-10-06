# MiniHelmets 🏁  

**Versión:** 1.0.0  

Proyecto **MiniHelmets**, una tienda online de mini cascos coleccionables de F1 y MotoGP.  
Este repositorio contiene dos partes principales:  

- `frontend/`: Interfaz de usuario.  
- `backend/`: API y lógica del negocio.  

## Estado del proyecto  
🚧 En desarrollo (versión inicial).  

## README  
Este repositorio tiene como objetivo centralizar el desarrollo de la aplicación **MiniHelmets**.  

## Tecnologías utilizadas  
Este proyecto está desarrollado con las siguientes tecnologías y herramientas:  

- **Visual Studio Code** – Editor de código.  
- **Git** – Control de versiones para gestionar los cambios del código.  
- **Node.js** – Entorno de ejecución para JavaScript.  
- **Docker** – Para ejecutar la aplicación en contenedores fácilmente.

## Architecture Decision Records (ADRs)

### ADRs Documentados:

- **ADR-001** - Elección de MongoDB como base de datos principal
- **ADR-002** - Estructura monorepo para frontend y backend  
- **ADR-003** - Modelado de datos para e-commerce de coleccionables

*Consulta la carpeta `/docs/adrs/` para más detalles sobre las decisiones de arquitectura.*

## Herramientas de ayuda
### GITHUB subir archivos /carpetas

cd C:\Users\iker\Desktop\MiniHelmets

git add doc/

git commit -m "Añadir carpeta doc"

git pull origin main

git push origin main

## Conexión Docker con Mongo 
### Mongo DB Compass
Creamos nuestro archivo "docker-compose.yaml" para crear nuestro contenedor y subir la imagen de mongo
también crearemos el archivo ".env" donde pondremos las credenciales del Mongo DB.
### Mongo DB Express
Dentro del archivo ".yaml", añadimos la imagen de Mongo DB Express, para tener interfaz grafica de la 
base de datos, y en el ".env" añadimos las credenciales. 

## Autores  
- Iker Cordero Luengo
