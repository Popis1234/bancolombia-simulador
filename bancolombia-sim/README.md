# Bancolombia – Simulador de Inversiones y Copy Trading

Prototipo conceptual de plataforma fintech inspirada en BingX, adaptada a la identidad visual de Bancolombia (amarillo, negro y blanco).

**Todo el dinero y las operaciones son 100% simulados.** No hay depósitos, retiros ni inversiones reales. No tiene afiliación oficial con Bancolombia S.A.

## Características

- Simulador con capital virtual inicial de **$100.000.000 COP**
- Mercados: Criptomonedas, Acciones, Materias Primas, Divisas e Índices
- Compra y venta funcional (actualiza saldo y portafolio)
- **Copy Trading** exclusivo del Plan Pro (con modal de upgrade)
- Rankings de traders ficticios (claramente etiquetados)
- Planes: Gratuito / Premium / Pro
- Persistencia en localStorage del navegador
- Diseño responsive

## Cómo desplegar en Vercel (recomendado – gratis)

1. Crea una cuenta en [vercel.com](https://vercel.com) (puedes usar GitHub).
2. Sube este proyecto a un repositorio de GitHub (o usa el botón "Import" de Vercel).
3. En Vercel:
   - Click en **Add New… → Project**
   - Importa el repositorio
   - Framework Preset: **Next.js**
   - Deja el resto por defecto
   - Click **Deploy**

En menos de 1 minuto tendrás un link público tipo:
`https://bancolombia-sim-xxxxx.vercel.app`

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Notas importantes

- Los precios y rentabilidades son **simulados**.
- Los perfiles de traders son **ficticios** y generados solo para demostración.
- La restricción de Copy Trading se valida en el estado de la aplicación.
- No se procesan pagos reales.

## Estructura principal

- `/` → Dashboard / Simulador
- `/markets` → Listado de activos
- `/asset/[id]` → Detalle + compra/venta
- `/copy-trading` → Rankings y copia de estrategias (Pro)
- `/subscriptions` → Planes
- `/profile` → Login + portafolio + historial
