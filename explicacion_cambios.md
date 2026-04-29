# Resum de Canvis - Sessió 18

S'han implementat els Dashboards d'Usuari i Administrador amb protecció de rutes (RBAC).

## 1. Backend (Node/Express)
- **Models & Services**: S'ha afegit el camp `role` a la resposta del login/registre.
- **Nous Endpoints**:
  - `GET /api/auth/users`: Llista de tots els usuaris (Admin).
  - `GET /api/pedidos/mis-pedidos`: Historial de compres de l'usuari loguejat.
  - `GET /api/pedidos/stats`: Estadístiques de vendes per als gràfics (Admin).
- **Seguretat**: S'ha utilitzat `roleMiddleware` per restringir l'accés a les rutes d'administrador.

## 2. Frontend (React)
- **Component ProtectedRoute**: Gestiona l'accés a les pàgines segons si l'usuari està autenticat i el seu rol.
- **User Dashboard**:
  - Mostra dades del perfil.
  - Taula amb l'historial de comandes (ID, data, total, estat i productes).
- **Admin Dashboard**:
  - **Gràfics (Chart.js)**: Visualització de vendes i nombre de comandes dels darrers 7 dies.
  - **Gestió d'Usuaris**: Taula amb tots els usuaris registrats.
- **Navegació**: Enllaços dinàmics al Navbar segons el rol (`user` o `admin`).

## 3. Llibreries instal·lades
- `chart.js` i `react-chartjs-2` per a la visualització de dades.
