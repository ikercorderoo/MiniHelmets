# Informe d'Incidència: INC-2026-05-22-01
**Estat:** Resolta  
**Data/Hora de detecció:** 2026-05-22T08:15:30Z  
**Component afectat:** Mòdul de Checkout / Webhooks de Stripe  
**Gravetat:** Alta (Bloqueig de pagaments)

---

## 1. Descripció de l'incident
Alguns usuaris informaven que, després de completar el pagament amb èxit a la passarel·la de Stripe, la seva comanda continuava apareixent com a "pendent" (pending) al backend i a l'aplicació, i no es descomptava l'estoc dels productes.

---

## 2. Detecció i Traçabilitat (Observabilitat)

Gràcies a l'arquitectura d'observabilitat implementada (Sessió 20), vam poder traçar l'error utilitzant les següents mètriques i logs estructurats:

### Pas 1: Alerta de Mètriques d'Errors
L'endpoint de mètriques `/api/metrics` mostrava un pic inusual en el consum de CPU i, paral·lelament, els registres d'errors del servidor van registrar un increment significatiu de codis d'estat HTTP `400` en la ruta de Webhooks.

### Pas 2: Localització de la Traça mitjançant `requestId`
Vam buscar al fitxer de logs un esdeveniment fallit de tipus `/api/checkout/webhook`. Vam trobar el següent log d'error generat automàticament pel middleware `httpLogger`:

```json
{
  "level": 50,
  "time": "2026-05-22T08:15:32.145Z",
  "pid": 1240,
  "hostname": "srv-prod-01",
  "requestId": "e2a14e9f-9c02-4b2a-89a3-5c0241ff8e7b",
  "userId": null,
  "req": {
    "method": "POST",
    "url": "/api/checkout/webhook",
    "headers": {
      "host": "localhost:3000",
      "stripe-signature": "t=1672531199,v1=undefined..."
    }
  },
  "res": {
    "statusCode": 400
  },
  "responseTime": 15,
  "msg": "POST /api/checkout/webhook failed with status 400"
}
```

### Pas 3: Anàlisi detallada de la Traça manual (Logs dels controladors)
Filtrem tots els logs que compartien exactament el mateix `requestId: "e2a14e9f-9c02-4b2a-89a3-5c0241ff8e7b"`. Vam localitzar el log detallat generat pel bloc `catch` dins del controlador `stripeWebhook`:

```json
{
  "level": 50,
  "time": "2026-05-22T08:15:32.148Z",
  "requestId": "e2a14e9f-9c02-4b2a-89a3-5c0241ff8e7b",
  "error": "No signing website secrets found or webhook secret has expired",
  "msg": "Error processing Stripe webhook"
}
```

---

## 3. Causa Arrel
El secret del webhook de Stripe (`STRIPE_WEBHOOK_SECRET`) guardat al fitxer `.env` del servidor de producció havia expirat o s'havia inserit incorrectament després de l'últim desplegament. Això va provocar que el mètode `stripe.webhooks.constructEvent()` llancés una excepció per signatura invàlida, retornant un codi de resposta HTTP `400` i impedint que s'actualitzés l'estat de les comandes.

---

## 4. Resolució
1. Es va regenerar el secret de signatura de webhooks (Signing Secret) des de la consola de desenvolupadors de Stripe.
2. Es va actualitzar la variable d'entorn al fitxer `.env`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_349d...actualitzada
   ```
3. Es va reiniciar el servidor Node.
4. Es va verificar el correcte funcionament simulant peticions i observant els nous logs amb èxit:
   ```json
   {
     "level": 30,
     "time": "2026-05-22T08:25:01.002Z",
     "requestId": "fa92a34b-b01c-4da8-bd7d-a128e46bc9fa",
     "eventType": "checkout.session.completed",
     "msg": "Stripe webhook event received"
   }
   ```

---

## 5. Mesures preventives adoptades
* **Supervisió de l'Endpoint de Salut:** El monitoratge automatitzat ara realitza pings a `/api/health` cada minut.
* **Rotació de Secrets Controlada:** S'ha establert un recordatori per revisar els secrets de Stripe abans del seu venciment.
