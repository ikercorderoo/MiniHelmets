# Explicació Sessió 14 (19): Checkout

En aquesta sessió s'ha implementat el flux de **Checkout**, permetent als usuaris finalitzar la seva compra introduint dades d'enviament i pagament.

## Canvis Realitzats

### 1. Backend (API)
- **Model de Pedido**: S'ha ampliat l'esquema de `pedido.js` per incloure:
  - `adreca`, `ciutat`, `codi_postal`, `telefon` (obligatoris).
  - `metode_pagament`: Validat amb un `enum` (`Targeta`, `PayPal`, `Efectiu`).
- **Controlador**: El `pedidoController.js` ara rep i emmagatzema tota la informació del formulari de checkout.

### 2. Frontend
- **Nova Pàgina de Checkout**: S'ha creat `Checkout.jsx` amb un formulari complet de Bootstrap.
- **Validacions**: El formulari comprova que tots els camps obligatoris estiguin plens abans d'enviar la petició.
- **Navegació**: S'ha afegit la ruta `/checkout` al fitxer `main.jsx` i s'ha enllaçat des de la cistella de la pàgina principal.
- **Gestió d'Estat**: Un cop la compra és exitosa, es buida el `localStorage` de la cistella i es redirigeix a l'usuari a la home amb un missatge d'èxit.

## Metodologia Aplicada
- Ús de **Bootstrap** per a un disseny net i responsive.
- Validacions de **Mongoose** al backend segons els apèndixs.
- Codi basat en components funcionals de **React**.
