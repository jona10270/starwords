# CLAUDE.md

Guía para Claude Code (claude.ai/code) al trabajar en este repositorio.
Léela entera antes de tocar código. Si algo de aquí contradice al código, **manda el
código**: avisa a Jonathan y actualiza este fichero.

---

## 1. Reglas de trabajo con Jonathan (no negociables)

1. **Pedir permiso antes de crear o editar cualquier fichero.** Aunque el cambio sea
   exactamente el que acaba de pedir: di qué fichero, qué vas a poner y por qué; espera el OK.
2. **Explicar siempre en este orden: cómo → por qué → ejemplo.** Está aprendiendo frontend
   (viene de NestJS, donde ya es sólido). Cuando algo tenga equivalente en Nest, dilo: es
   la forma más rápida de que le encaje.
3. **Español** en las respuestas y en los comentarios de código. **Inglés** en los
   identificadores: variables, funciones, componentes, tipos y nombres de fichero.
4. **De momento NO hay tests.** Es una decisión suya, tomada a propósito. No añadas Vitest,
   ni ficheros `.test.ts`, ni sugieras tests en cada respuesta. Cuando llegue el momento,
   lo dirá él.
5. **No lances comprobaciones por iniciativa propia** (`pnpm lint`, `pnpm build`). Solo si
   las pide.
6. **Nada de inventar patrones.** Este proyecto tiene una arquitectura decidida (sección 4)
   y una lista de cosas prohibidas (sección 9). Si algo no encaja, pregunta antes.
7. **Un cambio, una explicación.** Mejor un módulo bien entendido que cuatro copiados.

---

## 2. Qué es este proyecto

Frontend del explorador de Star Wars. Consume la API propia del backend NestJS que está en
`C:\Users\jona\Documents\PROJECTS\star-words` (repositorio aparte, **no** un monorepo).

Endpoints reales del backend (puerto 3000, sin prefijo global):

| Ruta | Respuesta |
|---|---|
| `GET /starwars/people` | `{ people: PeopleVM[] }` |
| `GET /starwars/people/:id` | `{ people: PeopleVM }` |
| `GET /starwars/films` · `/films/:id` | películas |
| `GET /starwars/starships` | naves |
| `POST /auth/...` | login con JWT |

**Forma real de `PeopleVM`** (heredada de la SWAPI, importante para el mapper):
`name`, `height` (string, a veces `"unknown"`), `mass` (string), `hair_color`,
`skin_color`, `eye_color`, `birth_year`, `gender`, `homeworld` (URL), `films` (URLs),
`species`, `vehicles`, `starships` (URLs), `url` (URL — **aquí está la identidad, no hay
campo `id`**).

---

## 3. Comandos

```bash
pnpm dev        # servidor de desarrollo → http://localhost:5173
pnpm build      # tsc -b && vite build
pnpm preview    # sirve el build
pnpm lint       # ESLint
```

Gestor de paquetes: **pnpm** (igual que el backend). No uses npm ni yarn aquí.

---

## 4. Arquitectura

Hexagonal (puertos y adaptadores) en **tres** capas:

```
presentation  →  domain  ←  infrastructure
```

**La regla:** las dependencias apuntan hacia dentro.

- `domain/` — entidades y **puertos** (interfaces de repositorio). **Cero imports
  externos**: ni React, ni axios, ni Tailwind. Si metes uno, has roto la arquitectura.
- `infrastructure/` — adaptadores que implementan los puertos, DTOs, mappers y el cliente
  axios. Es la única capa que sabe que existe HTTP.
- `presentation/` — páginas, componentes y hooks de TanStack Query. **No sabe que existe
  axios.**

### Estructura

```
src/
├─ domain/<entidad>/
│  ├─ <entidad>.ts                 interface de la entidad
│  └─ <entidad>.repository.ts      EL PUERTO
├─ infrastructure/
│  ├─ http/api-client.ts           axios + interceptores
│  └─ <entidad>/
│     ├─ <entidad>.dto.ts          lo que manda la API, tal cual
│     ├─ <entidad>.mapper.ts       DTO → dominio
│     └─ <entidad>-api.adapter.ts  implements <Entidad>Repository
├─ presentation/
│  ├─ <entidades>/
│  │  ├─ hooks/use-<entidades>.ts
│  │  ├─ pages/<entidades>-page.tsx
│  │  └─ components/<algo>.tsx
│  └─ shared/components/
├─ store/                          Zustand
└─ router/router.tsx
```

**Nota:** la estructura se va creando conforme avanza el proyecto. Hoy solo existen
`App.tsx` y `main.tsx`; no la montes entera de golpe "por si acaso".

---

## 5. Convención de nombres

- **Ficheros**: `kebab-case` con el rol como sufijo → `character.mapper.ts`,
  `character-api.adapter.ts`, `characters-page.tsx`, `use-characters.ts`.
- **Componentes**: nombre en `PascalCase`, fichero en `kebab-case`.
  `character-card.tsx` exporta `CharacterCard`.
- **Componentes siempre arrow functions**, nunca `function Componente()`.
- **Tipos e interfaces**: `PascalCase`, sin prefijo `I`.
- **La entidad del dominio se llama `Character`**, aunque el endpoint sea `/people`. Es un
  renombrado deliberado: `people` es herencia de la SWAPI y el adaptador lo absorbe. Es
  justo el trabajo para el que existe la capa de infraestructura.

---

## 6. Los patrones obligatorios

### Cliente HTTP — un único sitio

```ts
// src/infrastructure/http/api-client.ts
export const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_URL });
// interceptor de request → mete el Bearer token
// interceptor de response → si 401, limpia sesión y manda al login
```

Ningún otro fichero importa axios. Los adaptadores usan `apiClient`.

### Dominio + puerto

```ts
// src/domain/character/character.ts
export interface Character {
  id: string;
  name: string;
  heightInCm: number | null;
  // ...
}

// src/domain/character/character.repository.ts
export interface CharacterRepository {
  getCharacters(): Promise<Character[]>;
  getCharacter(id: string): Promise<Character>;
}
```

### Mapper — la aduana

Aquí y **solo aquí** se renombra, se convierten tipos y se extraen ids de las URLs:

```ts
// src/infrastructure/character/character.mapper.ts
const idFromUrl = (url: string) => url.split('/').filter(Boolean).pop() ?? '';

// La SWAPI manda números como texto y usa "unknown" cuando no lo sabe.
const toNumberOrNull = (value: string) => {
  const parsed = Number(value.replace(',', ''));
  return Number.isNaN(parsed) ? null : parsed;
};

export const toCharacter = (dto: CharacterDTO): Character => ({
  id: idFromUrl(dto.url),
  name: dto.name,
  heightInCm: toNumberOrNull(dto.height),
  hairColor: dto.hair_color,
  homeworldId: idFromUrl(dto.homeworld),
  filmIds: dto.films.map(idFromUrl),
});
```

### Adaptador

```ts
// src/infrastructure/character/character-api.adapter.ts
export class CharacterApiAdapter implements CharacterRepository {
  async getCharacters(): Promise<Character[]> {
    const { data } = await apiClient.get<{ people: CharacterDTO[] }>('/starwars/people');
    return data.people.map(toCharacter);   // ojo: la respuesta viene envuelta en `people`
  }
}

export const characterRepository: CharacterRepository = new CharacterApiAdapter();
```

### Hook de datos — es la capa de aplicación

```ts
// src/presentation/characters/hooks/use-characters.ts
export const useCharacters = () =>
  useQuery({
    queryKey: ['characters'],
    queryFn: () => characterRepository.getCharacters(),
  });
```

**Convención de `queryKey`**: `['characters']` para el listado, `['characters', id]` para
el detalle, `['characters', { search, page }]` cuando haya filtros. Siempre del más
general al más específico, para poder invalidar por prefijo.

### Estados en la página

```tsx
const { data, status } = useCharacters();

if (status === 'pending') return <Spinner />;
if (status === 'error') return <ErrorMessage />;
return <CharacterList characters={data} />;
```

`status` ya es una unión discriminada: **no montes tu propio `LoadingState`/`LoadedState`**
como en tuvi-backoffice. Query ya lo da hecho.

---

## 7. RECETA — añadir una entidad nueva

Orden exacto. Ejemplo con `film`:

1. `src/domain/film/film.ts` → `interface Film`
2. `src/domain/film/film.repository.ts` → `interface FilmRepository` (el puerto)
3. `src/infrastructure/film/film.dto.ts` → los campos **tal y como los manda la API**
4. `src/infrastructure/film/film.mapper.ts` → `toFilm(dto)`
5. `src/infrastructure/film/film-api.adapter.ts` → `implements FilmRepository`
   + `export const filmRepository = new FilmApiAdapter()`
6. `src/presentation/films/hooks/use-films.ts` → el `useQuery`
7. `src/presentation/films/pages/films-page.tsx` → la página
8. `src/presentation/films/components/...` → los componentes que haga falta
9. `src/router/router.tsx` → la ruta

**Antes del paso 3, mira el view-model real del backend** en
`star-words/src/app/rest/api/modules/starwars/model/`. Los nombres no se adivinan.

---

## 8. RECETA — añadir un campo a una entidad

1. `domain/<entidad>/<entidad>.ts` → el campo, con el tipo que quiere el frontend
2. `infrastructure/<entidad>/<entidad>.dto.ts` → el campo, con el nombre y tipo del backend
3. `infrastructure/<entidad>/<entidad>.mapper.ts` → la traducción
4. El componente que lo pinta

Si el campo puede venir vacío o como `"unknown"`, **que sea opcional o `| null`** en el
dominio, y resuélvelo en el mapper. Nunca dejes que un `"unknown"` llegue a un componente.

---

## 9. Prohibido en este proyecto (y por qué)

| No hacer | Por qué |
|---|---|
| **`Either` / devolver errores como valor** | TanStack Query detecta el fallo porque la promesa **se rechaza**. Un `Either.left` lo leería como éxito y `isError` no saltaría nunca |
| **Capa de casos de uso con clases `execute()`** | con operaciones de solo lectura, el hook de Query ya es el caso de uso. Solo se saca una función a `application/` si coordina varias llamadas |
| **Contenedor de DI (Awilix o similar)** | tres entidades: un `export const` y un import normal sobran |
| **Patrón Bloc / observable propio** | Query + Zustand cubren estado de servidor y de cliente |
| **`fetch` o `axios` dentro de un componente** | siempre pasa por adaptador → `apiClient` |
| **Filtros o paginación en Zustand** | van en la URL con `useSearchParams`: enlaces compartibles y botón «atrás» |
| **Redux Toolkit, librerías de componentes pesadas** | fuera del stack acordado |
| **Tests** | aplazados a propósito (regla 4) |

Este proyecto **no es tuvi-backoffice**. Si vienes de esa skill: allí hay `Either`, Blocs,
Awilix y casos de uso por fichero porque tiene 18 módulos y varios desarrolladores. Aquí
nada de eso aplica.

---

## 10. Trampas conocidas

1. **Variables de entorno**: solo llegan al navegador las que empiezan por `VITE_`, y se
   leen con `import.meta.env.VITE_API_URL`. **No** `process.env` (eso es de tuvi-backoffice,
   que usa el `define` de Vite).
2. **Los `paths` del alias `@` van en `tsconfig.app.json`**, no en el `tsconfig.json` raíz.
   Vite parte el tsconfig en tres ficheros y el raíz no cubre `src/`.
3. **La respuesta del backend viene envuelta**: `{ people: [...] }`, no un array pelado.
   Es un fallo típico al escribir el adaptador.
4. **`PeopleVM` no tiene `id`.** La identidad se saca de `url`
   (`https://swapi.info/api/people/1` → `'1'`). Sin eso no puedes construir enlaces al detalle.
5. **`height` y `mass` llegan como `string`** y a veces valen `"unknown"`. Convertir en el
   mapper a `number | null`.
6. **Tailwind v4 no lleva `tailwind.config.js`**: se configura con el plugin en
   `vite.config.ts` y `@import "tailwindcss";` en `src/index.css`.
7. **CORS**: si el backend no permite el origen `http://localhost:5173`, las peticiones
   fallarán desde el navegador aunque funcionen en Postman. Se arregla en el backend
   (`app.enableCors()`), no aquí.

---

## 11. Estado actual

- ✅ Proyecto creado con Vite (React 19 + TypeScript), `.env` / `.env.example`,
  `.gitignore`, git inicializado con un primer commit.
- ✅ Alias `@` configurado en `vite.config.ts` y `tsconfig.app.json`.
- ✅ `src/index.css` con `@import "tailwindcss";`.
- ⏳ **Pendiente antes de programar**: instalar las dependencias del stack. `vite.config.ts`
  ya importa `@tailwindcss/vite`, que todavía **no está instalado** — hasta que se instale,
  `pnpm dev` falla:

  ```bash
  pnpm add react-router-dom @tanstack/react-query axios zustand
  pnpm add -D tailwindcss @tailwindcss/vite @tanstack/react-query-devtools
  ```

- ⏳ Siguiente paso previsto: `api-client.ts`, el `QueryClientProvider`, el router y el
  módulo `character` completo como plantilla para los demás.
