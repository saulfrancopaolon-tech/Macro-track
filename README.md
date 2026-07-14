# Macros — tracker de comidas, macros, sal y agua

App web estilo iOS para registrar tus comidas, definir qué macros/nutrientes te importan, monitorear sal y agua, y llevar tu racha de días cumpliendo tu meta. Hecha con React + Vite. Los datos se guardan en el `localStorage` del navegador (no hay backend).

## 1. Probarla en tu computadora

Necesitas [Node.js](https://nodejs.org) 18 o superior instalado.

```bash
npm install
npm run dev
```

Abre la URL que te muestre la terminal (normalmente `http://localhost:5173`). Para verla como si fuera un celular, abre las herramientas de desarrollador del navegador (F12) y activa el modo de vista móvil.

## 2. Subirla a GitHub

```bash
git init
git add .
git commit -m "Primera versión de la app de macros"
```

Crea un repositorio nuevo y vacío en https://github.com/new (sin README, sin .gitignore — ya los trae este proyecto), luego:

```bash
git remote add origin https://github.com/TU_USUARIO/NOMBRE_DEL_REPO.git
git branch -M main
git push -u origin main
```

## 3. Publicarla en Vercel

**Opción A — desde la web (recomendada):**
1. Entra a https://vercel.com y crea una cuenta (puedes usar tu cuenta de GitHub).
2. Haz clic en "Add New… → Project".
3. Elige el repositorio que acabas de subir.
4. Vercel detecta automáticamente que es un proyecto Vite. Deja los valores por defecto:
   - Build Command: `npm run build` (o `vite build`)
   - Output Directory: `dist`
5. Haz clic en "Deploy". En un par de minutos tendrás una URL pública tipo `tu-app.vercel.app`.

**Opción B — desde la terminal:**
```bash
npm install -g vercel
vercel login
vercel        # despliegue de prueba
vercel --prod # despliegue final a producción
```

Cada vez que hagas `git push` a `main`, Vercel vuelve a desplegar automáticamente.

## Funciones principales

- **Hoy**: anillo de calorías, racha de días cumplidos, agua y macronutrientes del día.
- **Registro**: tus comidas agrupadas por Desayuno/Comida/Cena/Snack. Toca cualquier comida para **editar su nombre y valores**, o bórrala con el ícono de basurero.
- **Progreso**: gráfica de calorías de los últimos 7 días y promedios de macros.
- **Perfil**:
  - Mapa de constancia de las últimas 4 semanas.
  - Meta de agua ajustable.
  - Lista de **nutrientes que sigues**: puedes cambiar su meta diaria, **activarlos/desactivarlos**, o **eliminarlos**.
  - **Agregar nutriente propio** (nombre, unidad, meta y color) — por ejemplo fibra, azúcar, potasio, etc.
  - Botones para restaurar los datos de ejemplo o borrar todo.

## Notas

- Todo vive en `localStorage`: si borras los datos del sitio en el navegador, o usas otro dispositivo, empiezas desde cero. Si más adelante quieres que tus datos se sincronicen entre dispositivos, el siguiente paso natural es agregar una base de datos (por ejemplo Supabase o Firebase) — con gusto te ayudo si llegas a ese punto.
- El nutriente "Calorías" es el único que no se puede desactivar ni borrar, porque es el que alimenta el anillo principal.
