# Documentació d'Observabilitat i Logs - Sessió 20

Aquest document detalla tots els canvis implementats al backend de **MiniHelmets** per complir amb els requisits de la **Sessió 20** sobre observabilitat, traçabilitat de peticions, mètriques i gestió d'errors.

---

## 1. Dependències instal·lades
S'han instal·lat i configurat els següents paquets de Node.js al backend:
* **`pino`**: Un logger ràpid i estructurat que genera logs en format JSON (ideal per a producció).
* **`pino-http`**: Middleware d'Express per registrar automàticament els detalls de les sol·licituds i respostes HTTP.
* **`uuid`**: Generació d'identificadors únics v4 per al seguiment de peticions (`requestId`).
* **`pino-pretty`** *(Dev)*: Formatador per fer els logs llegibles i acolorits al terminal en entorns de desenvolupament.

---

## 2. Configuració de l'Entorn i del Logger
* **Fitxer d'Entorn (`.env`)**: S'han configurat les variables per controlar el comportament del sistema de logs:
  ```bash
  NODE_ENV=development
  LOG_LEVEL=debug
  ```
* **Logger (`src/config/logger.js`)**: Configura el logger Pino. Si `NODE_ENV` no és `'production'`, s'activa el transport `pino-pretty` perquè els logs es mostrin ordenats i acolorits al terminal. En producció, s'emeten en format JSON ràpid sense capçaleres innecessàries.

---

## 3. Middlewares d'Observabilitat creats
S'han creat tres middlewares específics a la carpeta `src/middleware/`:

### A. Request ID (`src/middleware/requestId.js`)
* Genera un UUID únic per a cada petició entrant (o aprofita el capçal `x-request-id` si ja ve de fora).
* Emmagatzema aquest identificador a la petició (`req.requestId`) i l'afegeix com a capçalera a la resposta HTTP (`X-Request-Id`). Això permet traçar una sol·licitud de principi a fi.

### B. HTTP Logger (`src/middleware/httpLogger.js`)
* S'encarrega del registre automàtic de les peticions HTTP.
* S'integra directament amb `requestId` per recollir el `req.requestId` i el `req.user?.id` (si l'usuari està autenticat).
* Classifica automàticament els nivells de log segons el codi d'estat de la resposta:
  * Codis `>= 500` o errors: nivell `error`.
  * Codis `>= 400` (com 401 o 404): nivell `warn`.
  * Codis inferiors (com 200 o 201): nivell `info`.

### C. Gestor d'Errors Global (`src/middleware/errorHandler.js`)
* S'activa automàticament quan es fa servir `next(error)` en algun controlador.
* Registra l'error amb el nivell `error` incloent-hi el missatge, el `requestId` i la pila de crides (`stack`) en mode desenvolupament.
* Retorna un format de resposta compatible JSON que inclou el `message`, `mensaje`, `ok: false`, `status: 'error'` i el `requestId`.

---

## 4. Rutes de Salut i Mètriques
S'ha creat el fitxer de rutes `src/routes/healthRoutes.js` per exposar les dades del sistema:

* **`GET /api/health`** *(Públic)*:
  * Retorna l'estat general de l'aplicació (`status: 'ok'`).
  * Temps de funcionament del servidor (`uptime`).
  * Marca de temps actual (`timestamp`).
  * Estat actual de la connexió a MongoDB (`database: connected/disconnected`).

* **`GET /api/metrics`** *(Restringit per a Administradors)*:
  * Retorna mètriques del procés de Node: ús de memòria (rss, heapTotal, heapUsed, external), ús de CPU del sistema, versió de Node.js i entorn.
  * Està protegit mitjançant `authMiddleware` i `roleMiddleware('admin')` per evitar exposar secrets o informació interna del servidor a públic general.

---

## 5. Integració en el Servidor (`src/index.js`)
* S'han registrat `requestId` i `httpLogger` al capdavant del flux d'Express (just abans de la resta d'accions).
* S'han carregat les rutes de salut i mètriques a `/api`.
* S'ha creat una ruta temporal **`GET /api/debug/error`** que força un error intern per comprovar si el middleware d'errors respon i traça correctament l'excepció amb el seu `requestId`.
* S'ha registrat `errorHandler` com a l'últim middleware del fitxer.

---

## 6. Logs Manuals en Controladors
S'ha instrumentat de forma manual el codi dels controladors clau per afegir detalls específics sobre les operacions sense desar dades privades:

### A. Productes (`src/controllers/productController.js`)
* Logs informatius a l'iniciar l'acció (`req.log.info`) i logs d'errors (`req.log.error`) en cas de fallada en la creació, llistat, edició o eliminació de productes.

### B. Autenticació (`src/controllers/authController.js`)
* Registre d'intents de login (inclosos els fallits de nivell `warn`).
* Registre de registres d'usuaris nous, tancaments de sessió i renovació de tokens de refresc.
* S'assegura de **no guardar mai** a les traces: contrasenyes, tokens JWT o secrets bancaris.

### C. Checkout i Pagaments (`src/controllers/checkoutController.js`)
* Logs quan s'inicia la verificació d'una comanda i la creació d'una sessió de pagament a Stripe.
* Logs informatius en rebre i processar correctament un webhook de Stripe per a pagament completat (`checkout.session.completed`) o fallit/expirat.
* Logs d'error si falla la validació dels imports o la connectivitat.

---

## 7. Informe d'Incidències
S'ha creat el fitxer [example-incident.md](file:///c:/Users/iker/Desktop/MiniHelmets/backend/docs/incidents/example-incident.md) per servir de document de referència en cas d'un incident de producció, descrivint com localitzar logs i problemes de webhook utilitzant el `requestId` de la petició.
