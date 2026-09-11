# Star Words — Frontend

Cliente web del proyecto **Star Words**: un explorador del universo de Star Wars
(personajes, películas y naves) construido sobre una API propia en NestJS.

Proyecto de aprendizaje con dos objetivos: practicar **arquitectura hexagonal en el
frontend** y montar un cliente React moderno de principio a fin.

---

## Índice

- [El proyecto](#el-proyecto)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Estructura de carpetas](#estructura-de-carpetas)
- [El recorrido de un dato](#el-recorrido-de-un-dato)
- [Decisiones de diseño](#decisiones-de-diseño)
- [Puesta en marcha](#puesta-en-marcha)
- [Convenciones](#convenciones)
- [Estado y roadmap](#estado-y-roadmap)

---

## El proyecto

Este repositorio es **solo el frontend**. Consume la API del backend, que vive en un
repositorio aparte:

```
Documents/PROJECTS/
├── star-words              ← backend (NestJS + TypeScript + TypeORM + Postgres)
└── star-words-frontend     ← este repositorio
```

El backend expone estos endpoints (puerto `3000` por defecto):

| Método | Ruta | Devuelve |
|---|---|---|
| `GET` | `/starwars/people` | `{ people: PeopleVM[] }` |
| `GET` | `/starwars/people/:id` | `{ people: PeopleVM }` |
| `GET` | `/starwars/films` | listado de películas |
| `GET` | `/starwars/films/:id` | una película |
| `GET` | `/starwars/starships` | listado de naves |
| `POST` | `/auth/...` | autenticación (JWT) |

La documentación viva de la API está en el Swagger del backend.

---

## Stack tecnológico

| Tecnología | Para qué | Por qué esta y no otra |
|---|---|---|
| **React 19** | interfaz y componentes | — |
| **TypeScript** | tipado en todo el proyecto | el tipo es la red de seguridad: obliga a pasar por todos los sitios afectados al cambiar algo |
| **Vite** | dev server y build | `create-react-app` está descontinuado; Vite arranca al instante |
| **React Router** | navegación | estándar de facto para SPAs |
| **TanStack Query** | datos del servidor: caché, `loading`, errores, reintentos | evita reimplementar a mano lo que ya está resuelto; además expone el estado como unión discriminada |
| **Axios** | cliente HTTP | interceptores: el token y el manejo del 401 se escriben **una vez** para toda la app |
| **Zustand** | estado propio del cliente (favoritos) | mínimo y sin ceremonia; Redux sobra para este tamaño |
| **Tailwind CSS v4** | estilos | rapidez de iteración sin salir del JSX |

**Deliberadamente fuera:** Redux Toolkit (innecesario teniendo Query + Zustand) y una
librería de componentes pesada (los componentes se construyen a mano, que también es
parte del aprendizaje).

---

## Arquitectura

Arquitectura **hexagonal (puertos y adaptadores)** en tres capas, adaptada al tamaño real
del proyecto.

```
┌──────────────────────────────────────────────────┐
│  PRESENTATION                                    │
│  páginas · componentes · hooks de TanStack Query │
└──────────────────────┬───────────────────────────┘
                       │ usa
                       ▼
┌──────────────────────────────────────────────────┐
│  DOMAIN                                          │
│  entidades (Character, Film, Starship)           │
│  puertos → interfaces de repositorio             │
│  ── cero dependencias externas ──                │
└──────────────────────▲───────────────────────────┘
                       │ implementa
                       │
┌──────────────────────┴───────────────────────────┐
│  INFRASTRUCTURE                                  │
│  adaptadores · DTOs · mappers · cliente axios    │
└──────────────────────┬───────────────────────────┘
                       ▼
                  API star-words
```

### La regla que gobierna todo

> **Las dependencias apuntan hacia dentro.**
> `presentation` → `domain` ← `infrastructure`

- `domain/` **no importa nada**: ni axios, ni React, ni Tailwind. Es TypeScript puro.
- `infrastructure/` implementa las interfaces que define `domain/`.
- `presentation/` consume el dominio y **no sabe que existe axios**.

La prueba: si algún día la API cambia de forma (o se sustituye por la SWAPI pública), solo
cambian los ficheros de `infrastructure/`. Ni un componente se entera.

---

## Estructura de carpetas

```
src/
├─ domain/                            QUÉ es cada cosa (sin dependencias)
│  ├─ character/
│  │  ├─ character.ts                 interface Character
│  │  └─ character.repository.ts      EL PUERTO (interfaz)
│  ├─ film/
│  └─ starship/
│
├─ infrastructure/                    CÓMO se consigue de verdad
│  ├─ http/
│  │  └─ api-client.ts                axios + interceptores (token, 401)
│  └─ character/
│     ├─ character.dto.ts             lo que manda la API, tal cual
│     ├─ character.mapper.ts          DTO → dominio (la aduana)
│     └─ character-api.adapter.ts     implements CharacterRepository
│
├─ presentation/                      lo que ve el usuario
│  ├─ characters/
│  │  ├─ hooks/use-characters.ts      TanStack Query
│  │  ├─ pages/characters-page.tsx
│  │  └─ components/character-card.tsx
│  ├─ films/
│  ├─ starships/
│  └─ shared/
│     └─ components/                  Button, Card, Spinner, ErrorMessage
│
├─ store/                             Zustand (favoritos)
├─ router/
│  └─ router.tsx
├─ App.tsx
└─ main.tsx
```

Alias de imports: `@` apunta a `src/`
(`import { Character } from '@/domain/character/character'`).

---

## El recorrido de un dato

Ejemplo real: pintar el listado de personajes.

```
Usuario entra en /characters
   ↓
CharactersPage                          presentation
   ↓
useCharacters()                         presentation — TanStack Query
   ↓
characterRepository.getCharacters()     domain — el PUERTO (interfaz)
   ↓
CharacterApiAdapter                     infrastructure — la implementación
   ↓ toCharacter(dto)                   infrastructure — el mapper
   ↓
apiClient.get('/starwars/people')       infrastructure — axios
   ↓
API star-words
```

### Por qué existe el mapper (aquí se ve solo)

La API devuelve los datos con la forma heredada de la SWAPI:

```jsonc
{
  "people": [{
    "name": "Luke Skywalker",
    "height": "172",                                  // string, y a veces "unknown"
    "mass": "77",
    "hair_color": "blond",                            // snake_case
    "birth_year": "19BBY",
    "homeworld": "https://swapi.info/api/planets/1",  // una URL, no un id
    "films": ["https://swapi.info/api/films/1"],
    "url": "https://swapi.info/api/people/1"          // la identidad va aquí dentro
  }]
}
```

Y el frontend quiere trabajar con esto:

```ts
interface Character {
  id: string;                  // '1', extraído de `url`
  name: string;
  heightInCm: number | null;   // 172, o null si venía "unknown"
  massInKg: number | null;
  hairColor: string;           // camelCase
  birthYear: string;
  homeworldId: string;         // '1', extraído de la URL
  filmIds: string[];
}
```

Esa traducción —renombrar, convertir `string` a `number`, extraer ids de URLs y manejar
los `"unknown"`— ocurre en **un único fichero**: `character.mapper.ts`. Fuera de ahí,
ningún componente sabe que la API usa `snake_case` ni que las alturas venían como texto.

---

## Decisiones de diseño

Las decisiones tomadas a propósito, con su razón:

**1. No hay capa de casos de uso.**
Un `GetCharactersUseCase` con un único `return this.repo.getCharacters()` no aporta nada
en un proyecto de lectura como este. El hook de TanStack Query (`useCharacters`) **es** el
caso de uso: tiene nombre de operación de negocio y es la única puerta por la que la UI
obtiene personajes. Si una operación llega a coordinar varias llamadas o a decidir algo,
se saca a una función en `application/` — pero solo entonces.

**2. Nada de `Either`. Los errores se lanzan.**
TanStack Query decide si algo falló mirando si la promesa **se rechaza**. Devolver un
`Either.left` haría que Query lo interpretase como éxito y que `isError` no se activara
nunca. Los dos modelos de error son incompatibles: aquí manda el de Query.

**3. Sin contenedor de inyección de dependencias.**
Con tres entidades, un `export const characterRepository = new CharacterApiAdapter()` y un
import normal cumplen la misma función que un contenedor, sin la indirección.

**4. Los filtros y la paginación viven en la URL, no en el estado.**
`/characters?search=luke&page=2` se puede compartir, funciona con el botón «atrás» y
sobrevive a un refresco. Se leen con `useSearchParams`. Zustand se reserva para el estado
que sí es del cliente y debe persistir: los favoritos.

**5. Un único punto de entrada por pantalla.**
Solo las páginas llaman a los hooks de datos. Los componentes reciben props y pintan. Así
una tarjeta de personaje se puede reutilizar en cualquier sitio sin arrastrar dependencias.

---

## Puesta en marcha

### Requisitos

- Node 20 o superior (probado con 22)
- pnpm
- El backend `star-words` corriendo en `http://localhost:3000`

### Instalación

```bash
pnpm install
```

### Variables de entorno

Copia `.env.example` a `.env` y rellena:

```
VITE_API_URL=http://localhost:3000
```

> Vite solo expone al navegador las variables que empiezan por `VITE_`. Se leen con
> `import.meta.env.VITE_API_URL`.

### Scripts

```bash
pnpm dev        # servidor de desarrollo → http://localhost:5173
pnpm build      # comprobación de tipos + build de producción
pnpm preview    # sirve el build para probarlo en local
pnpm lint       # ESLint
```

---

## Convenciones

**Ficheros** en `kebab-case`, con el rol como sufijo:
`character.mapper.ts`, `character-api.adapter.ts`, `characters-page.tsx`.

**Código** en inglés: nombres de variables, funciones, componentes y tipos.
Los comentarios, en español, y solo para explicar el *porqué* de algo no obvio.

**Componentes**: siempre arrow functions, con el nombre en `PascalCase` aunque el fichero
vaya en `kebab-case`.

**Nada de texto literal en los componentes**: los textos salen de un sitio centralizado.

**Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).

---

## Estado y roadmap

- [x] Proyecto inicializado (Vite + React 19 + TypeScript)
- [x] Alias `@` y variables de entorno
- [ ] Cliente HTTP con interceptores
- [ ] Router y layout base
- [ ] Módulo `character`: dominio → puerto → adaptador → mapper → hook → página
- [ ] Módulo `film`
- [ ] Módulo `starship`
- [ ] Favoritos con Zustand
- [ ] Buscador y paginación por URL
- [ ] Login contra `/auth` con JWT
- [ ] Tests (Vitest + React Testing Library) — **aplazado a propósito**
- [ ] Despliegue

---

## Licencia

Proyecto personal de aprendizaje.
