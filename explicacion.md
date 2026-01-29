# Explicación de Cambios - Cistella amb Backend (Sessió 12)

## Resumen
S'ha vinculat la cistella del frontend amb el backend (API), permetent carregar productes reals de la base de dades i guardar les comandes realitzades.

## Canvis Realitzats

### 1. **Backend (API)**

#### Models (`src/models/pedido.js`)
- Creat esquema `Pedido` amb Mongoose.
- Estructura: array de `items` (amb producte, quantitat, preu) i `total`.

#### Controlador i Rutes
- Creat `pedidoController.js` amb la funció `createPedido` per guardar la comanda a MongoDB.
- Creat `pedidoRoutes.js` amb la ruta `POST /` vinculada al controlador.
- Registrat la ruta `/api/pedidos` a l'arxiu principal.

#### Configuració (`src/index.js`)
- Afegit middleware **CORS** manual per permetre la comunicació entre el frontend (port 5173) i el backend (port 3000).

### 2. **Frontend (`Home.jsx`)**

#### Càrrega de Productes (`fetch`)
- Substituït l'array estàtic de productes.
- Implementat `useEffect` per fer una petició `GET` a `http://localhost:3000/api/products`.
- Gestió de l'estat de càrrega (`loading`).

#### Finalitzar Compra
- Afegit el botó "Finalitzar Compra" a la cistella.
- Implementat funció `finalitzarCompra` que fa un `POST` a `http://localhost:3000/api/pedidos` amb el contingut del carret.
- Mostra un missatge d'èxit ("Compra realitzada amb èxit") i buida la cistella.

## Tecnologies Utilitzades
- **Frontend**: React (`useEffect`, `fetch`), Bootstrap.
- **Backend**: Node.js, Express, Mongoose.
- **Base de Dades**: MongoDB (per guardar `Pedido` i llegir `Product`).

## Com provar-ho
1. Assegurar que MongoDB està funcionant.
2. Engegar backend: `npm run dev` (a la carpeta `/api`).
3. Engegar frontend: `npm run dev` (a la carpeta `/frontend`).
4. La cistella ara mostra productes de la DB i guarda les comandes realment.
