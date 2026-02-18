# Explicació Sessió 13 (18): Catàleg, Filtres i Detall

En aquesta sessió s'ha ampliat l'e-commerce per permetre una navegació completa pels productes, incloent cerca i vista detallada.

## Canvis Realitzats

### 1. Backend (API)
- **Filtratge**: S'ha modificat el controlador i servei de productes per acceptar un paràmetre `nombre`. Ara la API permet fer cerques parcials (regex) i no distingeix entre majúscules i minúscules.
- **Detall**: S'ha assegurat que l'endpoint `GET /api/products/:id` retorna tota la informació del producte.

### 2. Frontend (Catàleg i Filtres)
- **Buscador en Temps Real**: S'ha afegit un input de cerca al Navbar de la Home. En escriure, la web fa una petició automàtica al backend filtrant els resultats sense necessitat de recarregar.
- **Persistència (localStorage)**: S'ha implementat la persistència de la cistella. Ara es guarda al navegador, permetent navegar entre la Home i el Detall sense perdre els productes afegits.
- **Enllaços al Detall**: S'han afegit enllaços a la pàgina de detall tant en les imatges com en els títols de cada producte.

### 3. Frontend (Pàgina de Detall)
- **Vista Detallada (`ProductDetail.jsx`)**: Nova pàgina que mostra tota la fitxa del producte: imatge en gran, preu, descripció completa i l'estoc disponible.
- **Rutes**: S'ha configurat la ruta dinàmica `/product/:id` per carregar automàticament el producte corresponent.
- **Afegir al Carret**: L'usuari pot afegir unitats directament des de la pantalla de detall.

## Com provar-ho
1. Utilitza la barra de cerca per trobar un casc (ex: "Alonso" o "Red Bull").
2. Clica a la imatge o al títol per entrar al detall del producte.
3. Afegeix el producte a la cistella i verifica que es manté al carret quan tornis a la Home.

---
**GitHub Link**: [Insereix aquí el teu link de GitHub]
