# Guía — Login y register con arquitectura hexagonal, TanStack Query y Zustand (star-words frontend)

> Guía escrita para Jonathan. Explica **qué escribir, cómo funciona y por qué**, fichero a fichero.
> El código se escribe a mano. Backend: `star-words/backend` (NestJS). Frontend: este proyecto.

**Para retomarlo en otra sesión**, pega esto en un chat nuevo:

> Lee `frontend/docs/guia-arquitectura-hexagonal-auth.md` y seguimos desde el paso N.
> No crees ficheros: explícame y yo los escribo.

**Estado (16-09-2026):**
- Hecho en el backend: `app.enableCors({ origin: 'http://localhost:5173' })` en `backend/src/main.ts`.
- Escritos a mano: pasos 1, 2.1 y 3.
- **Limpieza pendiente** por el cambio de plan (antes había `Either`, `DataError` y un `Bloc` propio):
  - Borrar `src/core/lib/Bloc.ts` y quitar su línea de `src/core/lib/index.ts`.
  - Borrar la carpeta `src/core/modules/common/domain/` (tenía `DataError.ts`).
  - Borrar `src/app/App.jsx` (está vacío; el bueno es `App.tsx`, paso 13.3).
  - Revisar `src/vite-env.d.ts`: la segunda interfaz se tiene que llamar `ImportMeta`, no `ImportMetaEnv`.
- **Siguiente: paso 4.**

**Cambios de plan respecto a la primera versión de esta guía** (decididos el 16-09-2026):
1. **Sin `Either`.** Los errores se lanzan, no se devuelven.
2. **Sin `DataError`.** El `HttpClient` convierte cualquier fallo en un `Error` con un mensaje listo para enseñar.
3. **Sin `Bloc` propio.** El estado de la sesión vive en un store de **Zustand**.
4. **TanStack Query** para hablar con el backend desde React (`useMutation` ahora, `useQuery` cuando haya listados).
5. **Un solo `index.ts` por módulo**, no uno por capa.
6. **Redux Toolkit no se usa.**

---

# PARTE A — Qué vamos a usar en general

## A.1 Las herramientas

| Herramienta | Para qué | ¿Instalada? |
|---|---|---|
| **React 19** | Pintar la interfaz | Sí |
| **TypeScript** | Tipos | Sí |
| **Vite** | Servidor de desarrollo y build | Sí |
| **Tailwind v4** | Estilos con clases (`bg-black`, `p-4`) | Sí |
| **react-router-dom** | Rutas `/login`, `/register`, `/` | Sí |
| **axios** | Peticiones HTTP al backend | Sí |
| **TanStack Query** | Llamar al backend desde React: estado de carga, errores, caché | Sí |
| **TanStack Query Devtools** | Panel para ver las peticiones en desarrollo | Sí |
| **Zustand** | Guardar estado compartido fuera de los componentes (la sesión) | Sí |

**Nada más.** Sin Awilix, sin Formik, sin Redux Toolkit y sin `Either`.

**Quién hace qué, en una frase:**
- **TanStack Query** → todo lo que **va o viene del backend** (login, registro, listados).
- **Zustand** → lo que la app **tiene que recordar** y leen varios sitios (¿hay sesión?).

## A.2 La arquitectura: el hexágono

```
          ┌────────────── ADAPTADOR PRIMARIO (conduce la app) ──────────────┐
          │  app/ + ui/     React: páginas, formularios, rutas,             │
          │                 hooks de TanStack Query y de Zustand            │
          └──────────────────────────────┬──────────────────────────────────┘
                                         │ llama a
          ┌──────────────────────────────▼──────────────────────────────────┐
          │  core/modules/auth/app/     casos de uso + authStore (Zustand)  │
          │                             (PUERTO PRIMARIO = los casos de uso)│
          │  core/modules/auth/domain/  AuthSession + interfaces            │
          │                             (PUERTOS SECUNDARIOS)               │
          └──────────────────────────────▲──────────────────────────────────┘
                                         │ implementa
          ┌──────────────────────────────┴──────────────────────────────────┐
          │  core/modules/auth/infra/   axios, localStorage                 │
          │                             ADAPTADORES SECUNDARIOS             │
          └─────────────────────────────────────────────────────────────────┘

             core/di/container.ts → decide qué adaptador va en cada puerto
```

**La regla de oro:** las flechas apuntan **hacia el centro**. `domain` no importa nada de fuera.
`app` solo importa `domain`. `infra` y React importan hacia dentro, nunca al revés.

**¿Y TanStack Query y Zustand, dónde van?**
- **TanStack Query vive solo en React** (`src/app/hooks/`). Es un adaptador primario: recibe lo que
  hace el usuario y llama a un caso de uso. El núcleo no sabe que existe.
- **El store de Zustand vive en el núcleo** (`core/modules/auth/app/`), pero creado con
  `zustand/vanilla`, que **no importa React**. Así los casos de uso pueden actualizar la sesión y
  React la lee con un hook.

## A.3 Los conceptos, uno por uno

| Concepto | Qué es | En esta app | Equivalente en Nest |
|---|---|---|---|
| **Entidad de dominio** | Los datos tal como los entiende la app | `AuthSession` | `UserModel` |
| **Puerto secundario** | Interfaz de "lo que necesito de fuera" | `AuthRepository`, `AuthSessionStorage` | Un `provide` con interfaz |
| **Adaptador secundario** | Clase que cumple el puerto con una tecnología | `AuthHTTPRepository` (axios), `LocalSessionStorage` | Un repositorio de TypeORM |
| **Caso de uso** | Una operación de la app | `LoginUseCase`, `RegisterUseCase`… | Un método de `AuthService` |
| **DTO** | Los datos tal como los manda el backend | `LoginResponseDTO` | Los `response/*.ts` |
| **Mapper** | Traduce DTO ↔ dominio | `AuthMapper` | El constructor de `UserVM` |
| **Store (Zustand)** | Guarda estado fuera de React y avisa cuando cambia | `authStore` | Un provider singleton que además avisa |
| **Mutation (TanStack Query)** | Una llamada que **cambia algo** (POST, PUT, DELETE) con su estado de carga y error | `useLogin`, `useRegister` | — |
| **Query (TanStack Query)** | Una llamada que **lee** datos (GET), con caché | Llegará con los personajes | — |
| **Composition root** | El único sitio donde se hace `new` y se conecta todo | `container.ts` | Los `@Module` |
| **Atomic Design** | Componentes por tamaño: átomos → organismos → páginas | `Button` → `LoginForm` → `LoginPage` | — |
| **Guardas de ruta** | Deciden si puedes entrar a una página | `AuthRoute`, `GuestRoute` | `JwtAuthGuard` |

## A.4 Equivalencias con tuvi-backoffice

| Qué | tuvi-backoffice | star-words |
|---|---|---|
| Estado de la sesión | `AuthBloc` (Bloc propio) + `useBlocState` | `authStore` (Zustand) + `useAuthState` |
| Datos del servidor (listados, detalle) | Un Bloc por módulo con estados `Loading` / `Loaded` / `Error` y un `useEffect` que lo dispara | `useQuery` de TanStack Query |
| Enviar un formulario | `bloc.createX()` + `try/catch` + snackbar + estado de "enviando" a mano | `useMutation` → te da `isPending` y `error` |
| Caché y reintentos | No hay caché como tal: cada pantalla vuelve a pedir los datos | Los da TanStack Query |
| Errores | `Either` + `DataError` (5 tipos) + `getOrThrow()` en el Bloc | Un `Error` con mensaje, lanzado desde `HttpClient` |
| Inyección de dependencias | Awilix + `Cradle.ts` + `useCradle()` | `container.ts` con `new` a mano |
| Sesión caducada (401) | `ClientEmitter` emite `SESSION_EXPIRED` y lo escucha el `AuthBloc` | `onUnauthorized` → `logoutUseCase` |
| Casos de uso | Clase con `execute()` | Igual |
| Repositorio + DTO + Mapper | Igual | Igual |
| Barrels | Uno por capa y uno por módulo | Uno por módulo |
| Formularios | Formik + Yup | `useState` + validación del navegador |
| Componentes | Atomic Design con MUI | Atomic Design con Tailwind |
| Dónde se guarda el token | `sessionStorage` | `localStorage` |
| Redux Toolkit | No | No |

**Lo que no cambia es lo importante:** dominio con puertos, adaptadores en `infra`, DTO + Mapper y
casos de uso. Eso es la arquitectura hexagonal. Bloc, Zustand o TanStack Query son **herramientas
de la capa de React**, y se pueden cambiar sin tocar el dominio.

### ¿Código propio o librería?

El backoffice programa a mano lo que aquí hacen Zustand y TanStack Query. Eso tiene **ventajas**:
control total y una dependencia menos. Pero **no lo hace más seguro**:
- El código propio **lo mantienes tú**. No tiene documentación, ni comunidad que encuentre sus
  fallos. Ejemplos reales: el `useBlocState` del backoffice pierde cambios en un caso concreto y
  su `handleError` tiene todos los `case` vacíos.
- Zustand y TanStack Query los usan millones de proyectos cada semana: sus fallos se encuentran y
  se arreglan rápido. Zustand además no tiene dependencias.
- Y el backoffice **sí tiene muchas dependencias externas**: Awilix, Formik, Yup, MUI, notistack,
  axios…

**La regla general:** se programa a mano lo que es **propio de tu negocio**. Lo que es igual en
todas las apps (caché, estado compartido, peticiones) se coge de una librería conocida.

## A.5 El viaje de un login, de punta a punta

```
LoginForm            el usuario pulsa "Entrar"      → onSubmit({ email, password })
LoginPage            recibe las credenciales        → login.mutate(credentials)
useLogin             (TanStack Query)               → loginUseCase.execute(credentials)
LoginUseCase         orquesta                       → authRepository.login(credentials)
AuthHTTPRepository   (adaptador)                    → AuthMapper.toLoginRequestDTO()
                                                    → httpClient.post('/auth/login')
HttpClient           axios                          → POST http://localhost:3000/auth/login
                     ← { auth: { accessToken, tokenType, expiresIn } }
AuthHTTPRepository   ← AuthMapper.toAuthSession()   → return session
LoginUseCase         guarda y avisa                 → authSessionStorage.save(session)
                                                    → authStore.setSession(session)
GuestRoute           useAuthState() ve el cambio    → <Navigate to="/" />
HomePage             aparece

Si falla:
HttpClient           interceptor                    → throw new Error('Invalid credentials')
LoginUseCase         no captura                     → el error sube
useLogin             lo captura él solo             → login.error = Error
LoginPage            pinta login.error.message
```

## A.6 Estructura final de `src/`

```
src/
├─ main.tsx
├─ index.css
├─ vite-env.d.ts
├─ app/                                   REACT (adaptador primario)
│  ├─ App.tsx                             providers: TanStack Query + router
│  ├─ AppRoutes.tsx
│  ├─ ProtectedRoutes.tsx
│  ├─ queryClient.ts                      la caché de TanStack Query
│  ├─ hooks/ useAuthState.ts · useLogin.ts · useRegister.ts
│  └─ pages/ HomePage.tsx · LoginPage.tsx · RegisterPage.tsx
├─ core/                                  NO SABE QUE EXISTE REACT
│  ├─ config/index.ts
│  ├─ di/container.ts
│  ├─ lib/ UseCase.ts · index.ts
│  └─ modules/
│     ├─ common/
│     │  ├─ index.ts
│     │  └─ infra/ HttpClient.ts
│     └─ auth/
│        ├─ index.ts
│        ├─ domain/ AuthSession.ts · AuthCredentials.ts · AuthRepository.ts · AuthSessionStorage.ts
│        ├─ app/    authStore.ts · LoginUseCase.ts · RegisterUseCase.ts · LogoutUseCase.ts
│        │          RestoreSessionUseCase.ts
│        └─ infra/  AuthDTO.ts · AuthMapper.ts · AuthHTTPRepository.ts · LocalSessionStorage.ts
└─ ui/                                    COMPONENTES SIN LÓGICA DE NEGOCIO
   ├─ atoms/     Button.tsx · TextField.tsx · index.ts
   └─ organisms/ LoginForm.tsx · RegisterForm.tsx · index.ts
```

## A.7 Convenciones

1. **Nombres de fichero:** una clase, interfaz o componente va en PascalCase (`LoginUseCase.ts`).
   Una función suelta va en camelCase (`authStore.ts`, `useLogin.ts`).
2. **`import type`** cuando lo importado solo se usa como tipo. Lo exige el `tsconfig`
   (`verbatimModuleSyntax`). Truco: si lo usas con `new` o lo llamas, es `import`; si solo
   aparece detrás de `:` o de `implements`, es `import type`. Se pueden mezclar en una línea:
   `import { useState, type SubmitEvent } from 'react'`.
3. **Prohibido `enum` y prohibido `constructor(private readonly x)`.** Lo exige el `tsconfig`
   (`erasableSyntaxOnly`), porque los dos generan JavaScript por debajo. En su lugar, uniones
   de strings y campos asignados a mano. **En el backend de Nest sí se usa; aquí no.**
4. **Un `index.ts` por módulo.** Dentro del módulo se importa con ruta relativa **al fichero**
   (`../domain/AuthSession`). Desde fuera, con el alias del módulo (`@/core/modules/auth`).
5. **Componentes como arrow functions** y exports con nombre (`export const LoginPage`).
6. **El store solo lo escriben los casos de uso.** React lo **lee** con `useAuthState()` y nunca
   llama a `setSession` ni a `clearSession`.

## A.8 El contrato de errores

```
HttpClient (interceptor)  → convierte el error de axios en un Error con mensaje y lo lanza
Repositorio               → no captura nada
Caso de uso               → no captura nada
TanStack Query            → lo captura y lo deja en mutation.error
Página                    → pinta mutation.error.message
```

**Por qué así:** el único fichero que sabe cómo son los errores de axios y de Nest es `HttpClient`.
Si mañana cambias axios por `fetch`, solo tocas ese fichero. Y como TanStack Query captura el
error por ti, **no hay ni un `try/catch` en toda la app**.

**Lo que no tienes (y cuándo lo echarías de menos):** la página solo recibe un texto, no el código
HTTP. Si algún día una pantalla necesita saber si fue un 404 para hacer algo distinto, se crea un
`ApiError extends Error` con `statusCode` en `HttpClient`, y solo esa pantalla lo comprueba.

---

# PARTE B — Paso a paso

## PASO 1 — Preparar el proyecto

### 1.1 Dependencias

Ya están instaladas: `@tanstack/react-query`, `@tanstack/react-query-devtools`, `zustand`, `axios`,
`react-router-dom` y Tailwind. **No quites ni añadas nada.** Si en otro ordenador faltaran:

```bash
pnpm add @tanstack/react-query zustand axios react-router-dom
pnpm add -D @tanstack/react-query-devtools
```

**Por qué `-D` en las devtools:** solo se usan mientras programas. En el build de producción no
se pinta nada.

### 1.2 `.env.example`

```
VITE_API_URL=http://localhost:3000
```

**Cómo:** es una copia del `.env`, pero **sí se sube a git**.
**Por qué:** el `.env` no se sube porque puede tener secretos. El `.example` le dice a quien clone
el repo qué variables tiene que crear. Lo mismo que en el backend.
**Por qué `VITE_`:** Vite solo manda al navegador las variables con ese prefijo. Así un
`DB_PASSWORD` nunca acaba por error en el JavaScript que descarga cualquier visitante.

### 1.3 `src/vite-env.d.ts`

```ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

**Cómo:**
- Un `.d.ts` solo contiene tipos y no genera JavaScript.
- No tiene `import` ni `export`, así que es **global**, y estas interfaces se **fusionan** con las
  que ya trae Vite. En TypeScript, dos interfaces con el mismo nombre se juntan en una.
- `readonly` impide sobrescribir la variable desde el código.
- **Ojo con los nombres:** la primera es `ImportMetaEnv` (las variables) y la segunda es
  `ImportMeta` (el objeto `import.meta`). Si las dos se llaman `ImportMetaEnv`, no da error, pero
  no sirve de nada.

**Por qué:** sin este fichero, `import.meta.env.VITE_API_ULR` (mal escrito) no daría error. Con él,
el editor autocompleta el nombre y avisa si te equivocas.

### 1.4 `src/index.css`

Borrar todo el bloque comentado y dejar solo:

```css
@import "tailwindcss";
```

**Por qué:** Tailwind v4 se activa con esa línea. Lo demás era CSS de la plantilla de Vite.

### 1.5 Borrar `src/App.tsx`

Se crea de nuevo en `src/app/App.tsx`.
**Por qué:** todo lo que es React vive en `app/` o en `ui/`. En la raíz de `src` solo quedan el
punto de entrada (`main.tsx`), el CSS global y los tipos de Vite.

---

## PASO 2 — `core/lib`: la herramienta base

Antes había tres (`UseCase`, `Either` y `Bloc`). Ahora solo queda una: `Either` ya no se usa y el
trabajo del `Bloc` lo hace Zustand.

### 2.1 `src/core/lib/UseCase.ts`

```ts
export interface UseCase<Request, Response> {
  execute(request: Request): Promise<Response>;
}
```

**Cómo:**
- `<Request, Response>` son **genéricos**, huecos para tipos que se deciden al usar la interfaz.
- Toda clase que diga `implements UseCase<LoginCredentials, void>` **está obligada** a tener
  `execute(credentials: LoginCredentials): Promise<void>`. Si no, TypeScript da error.
- Si no necesita datos se usa `void`, y entonces se puede llamar `execute()` sin argumentos.
  TypeScript permite omitir un parámetro de tipo `void`.

**Por qué:**
- Un caso de uso es **la puerta por la que React entra al núcleo**. Es el puerto primario.
- **Todos se llaman igual (`execute`)**: no hay que recordar si era `run`, `handle` o `doLogin`.
- **Una clase por operación.** En Nest hay un `AuthService` con varios métodos; aquí son
  `LoginUseCase`, `RegisterUseCase`… Cada fichero hace una sola cosa.

**Diferencia con tuvi-backoffice:** allí es `execute(request?: IRequest): Promise<IResponse> | IResponse`.
Aquí `request` **no es opcional** (con `?` podrías llamar al login sin credenciales), **siempre es
`Promise`** (con `X | Promise<X>` nunca sabes si hay que poner `await`) y no hay prefijo `I`.

### 2.2 `src/core/lib/index.ts`

```ts
export * from './UseCase';
```

**Cómo:** es un **barrel** (barril). Permite escribir `import type { UseCase } from '@/core/lib'`.
**Por qué, si solo hay un fichero:** `lib` es la caja de herramientas genéricas. Si mañana añades
otra, nadie tiene que cambiar sus imports.

---

## PASO 3 — `src/core/config/index.ts`

```ts
interface AppConfig {
  apiUrl: string;
}

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error('Falta la variable VITE_API_URL en el fichero .env');
}

export const config: AppConfig = {
  apiUrl,
};
```

**Cómo:**
- `import.meta.env.VITE_API_URL` lee el `.env`. Gracias a `vite-env.d.ts`, TypeScript sabe que es
  `string`.
- El `if` hace **explotar la app al arrancar** si falta la variable o está vacía.
- `{ apiUrl }` es la abreviatura de `{ apiUrl: apiUrl }`.

**Por qué:**
- **Un único sitio lee `import.meta.env`.** Así `core` depende de Vite en un solo fichero.
- **Fallar pronto.** Sin el `if`, cada petición iría a `undefined/auth/login` y el fallo aparecería
  al pulsar "Entrar". Es lo mismo que validar el `.env` al arrancar en Nest.

**Ojo:** Vite solo lee el `.env` al arrancar. Si lo cambias, para y vuelve a lanzar `pnpm dev`.

---

## PASO 4 — Módulo `common`

Guarda lo que comparten **todos** los módulos. Ahora mismo, solo el cliente HTTP.

### 4.1 `src/core/modules/common/infra/HttpClient.ts`

```ts
import axios, { type AxiosInstance } from 'axios';

interface HttpClientProps {
  baseUrl: string;
  getToken: () => string | null;
  onUnauthorized: () => void;
}

interface ApiErrorBody {
  message?: string | string[];
}

const getErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError<ApiErrorBody>(error)) return 'Error desconocido';
  if (!error.response) return 'No se puede conectar con el servidor';

  const message = error.response.data?.message;
  if (Array.isArray(message)) return message.join(', ');
  return message ?? error.message;
};

export class HttpClient {
  private readonly api: AxiosInstance;

  constructor({ baseUrl, getToken, onUnauthorized }: HttpClientProps) {
    this.api = axios.create({ baseURL: baseUrl });

    this.api.interceptors.request.use((request) => {
      const token = getToken();
      if (token) request.headers.Authorization = `Bearer ${token}`;
      return request;
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error: unknown) => {
        const isExpiredSession =
          axios.isAxiosError(error) &&
          error.response?.status === 401 &&
          getToken() !== null;

        if (isExpiredSession) onUnauthorized();
        return Promise.reject(new Error(getErrorMessage(error)));
      },
    );
  }

  async post<T>(url: string, body: object): Promise<T> {
    const response = await this.api.post<T>(url, body);
    return response.data;
  }
}
```

**Qué es:** el único fichero de la app que **crea** axios y el único que **sabe cómo son sus
errores**.

**Cómo, línea a línea:**
- **`HttpClientProps`**: lo que necesita, pasado **como un objeto** con nombre.
  - `baseUrl`: `http://localhost:3000`, que llega del `config`.
  - `getToken`: **una función** que devuelve el token actual. No es el token: es "cómo conseguirlo".
  - `onUnauthorized`: **una función** a la que llamar cuando la sesión caduque.
- **`interface ApiErrorBody`**: la forma del cuerpo de error que manda Nest
  (`{ statusCode, message, error }`). `message` es un **string** (`"Invalid credentials"`) o un
  **array** cuando falla el `ValidationPipe`.
- **`getErrorMessage`**: convierte **cualquier** error en un texto. Mira tres casos por orden:
  1. **No es un error de axios** → `'Error desconocido'`.
  2. **Es de axios pero no hay `response`**: el backend no contestó (apagado o CORS) →
     `'No se puede conectar con el servidor'`.
  3. **El backend contestó con error** → su `message`. Si es un array, lo junta con comas. Si no
     hay mensaje, usa el genérico de axios.
  Está **fuera de la clase** porque no usa `this`, y **no se exporta** porque es un detalle interno.
- **`axios.create({ baseURL })`**: instancia propia, para escribir `post('/auth/login')`.
- **Interceptor de request**: se ejecuta **antes de cada petición**. Si hay token, añade la cabecera
  `Authorization: Bearer xxx`, la que espera el `JwtAuthGuard`. Tiene que devolver `request`.
- **Interceptor de response**: la primera función se ejecuta si todo va bien; la segunda, si hay
  error. Si es un **401 y además había token**, la sesión ha caducado y llama a `onUnauthorized()`.
- **`Promise.reject(new Error(...))`**: vuelve a lanzar, pero **ya traducido**. A partir de aquí
  nadie en la app ve un error de axios.
- **`post<T>`**: `T` es el tipo de lo que devuelve el backend. Devuelve `response.data`.

**¿Por qué "y además había token"?** Si te equivocas de contraseña, el backend también responde 401,
pero ahí no había sesión que cerrar.

**Por qué `new Error` y no un texto suelto:** lanzar siempre `Error` es la norma en JavaScript. Trae
el *stack trace* para la consola, y TanStack Query tipa sus errores como `Error`.

**Por qué funciones en vez de importar el store o el storage:** si `HttpClient` importara cosas de
`auth`, la capa HTTP dependería del módulo de auth y habría dependencia circular. Con funciones,
`HttpClient` **no sabe quién** da el token ni quién cierra la sesión: eso se decide en
`container.ts`.

**Por qué solo `post`:** login y register solo hacen POST. Para listar personajes se añade `get`.

**Equivalente en Nest:** los interceptores son como un `NestInterceptor`, y `getErrorMessage` hace
el trabajo de un *exception filter*, pero en el cliente.

**Ejemplo:**

| Qué pasa | Qué llega a la página en `error.message` |
|---|---|
| Contraseña mala | `Invalid credentials` |
| Email repetido al registrarte | `The email of new user exists` |
| Email con formato inválido (400) | Los mensajes del `ValidationPipe` separados por comas |
| Backend apagado | `No se puede conectar con el servidor` |

Los textos en inglés salen del backend (`auth.service.ts`, `user.public.controller.ts`). Si los
quieres en español, **se cambian allí**.

### 4.2 `src/core/modules/common/index.ts`

```ts
export * from './infra/HttpClient';
```

**Por qué un solo barrel:** desde fuera se importa `@/core/modules/common` y no hace falta saber en
qué carpeta está cada cosa. Con uno por módulo basta.

---

## PASO 5 — Módulo `auth`, capa `domain`

### 5.1 `src/core/modules/auth/domain/AuthSession.ts`

```ts
export interface AuthSession {
  accessToken: string;
  expiresAt: number;
}
```

**Cómo:** `accessToken` es el JWT; `expiresAt` es **el momento exacto en que caduca**, en
milisegundos desde 1970 (lo mismo que devuelve `Date.now()`).

**Por qué `expiresAt` y no `expiresIn` como manda el backend:** `expiresIn: 900` significa "caduca
dentro de 900 segundos **a partir de ahora**". Guardado tal cual, al recargar una hora después sigue
diciendo 900 y ya no sabes cuándo empezó a contar. La conversión la hace el mapper. **El dominio
guarda los datos como le conviene a la app, no como los manda el backend.**

### 5.2 `src/core/modules/auth/domain/AuthCredentials.ts`

```ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}
```

**Por qué no está `role`:** el backend lo acepta, pero por defecto crea `MAPPER` y rechaza `ADMIN`
con un 403. El usuario no debe elegirlo, así que no existe en el dominio.

### 5.3 `src/core/modules/auth/domain/AuthRepository.ts` — PUERTO

```ts
import type { LoginCredentials, RegisterData } from './AuthCredentials';
import type { AuthSession } from './AuthSession';

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  register(data: RegisterData): Promise<void>;
}
```

**Cómo:**
- Es una **interfaz**: dice **qué** se puede hacer, no **cómo**. No hay ni una línea de axios.
- `login` devuelve la sesión y `register` devuelve `void`, porque no necesitamos nada de la respuesta.
- **Si algo falla, se lanza un `Error`** con el mensaje para el usuario. La firma no lo dice: es el
  contrato de errores de A.8.

**Por qué:** es el **puerto secundario**, la pieza central del hexágono. El caso de uso depende de
**esta interfaz**, no de `AuthHTTPRepository`.

**Equivalente en Nest:** como si `AuthService` recibiera `@Inject('USER_REPOSITORY') repo: UserRepository`
(una interfaz) en lugar del `Repository<UserEntity>` de TypeORM.

**Por qué un solo puerto con varios métodos:** todas las operaciones van contra el mismo sitio y las
implementa la misma clase. Lo que se separa por operación son los casos de uso.

### 5.4 `src/core/modules/auth/domain/AuthSessionStorage.ts` — PUERTO

```ts
import type { AuthSession } from './AuthSession';

export interface AuthSessionStorage {
  save(session: AuthSession): void;
  get(): AuthSession | null;
  clear(): void;
}
```

**Por qué es un puerto:** para ver que **un puerto no es solo "la API"**. Es **cualquier cosa de
fuera** que la app necesita: un servidor, el disco, `localStorage`, una cookie…

**Por qué no se llama `SessionStorage`:** el navegador ya tiene un `sessionStorage` global.

---

## PASO 6 — Módulo `auth`, capa `app`

### 6.1 `src/core/modules/auth/app/authStore.ts`

```ts
import { createStore, type StoreApi } from 'zustand/vanilla';

import type { AuthSession } from '../domain/AuthSession';

export type AuthState =
  | { kind: 'CheckingAuthState' }
  | { kind: 'AuthenticatedAuthState'; session: AuthSession }
  | { kind: 'UnauthenticatedAuthState' };

interface AuthStoreState {
  auth: AuthState;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
}

export type AuthStore = StoreApi<AuthStoreState>;

export const createAuthStore = (): AuthStore =>
  createStore<AuthStoreState>()((set) => ({
    auth: { kind: 'CheckingAuthState' },
    setSession: (session) =>
      set({ auth: { kind: 'AuthenticatedAuthState', session } }),
    clearSession: () => set({ auth: { kind: 'UnauthenticatedAuthState' } }),
  }));
```

**El problema que resuelve:** el estado de la sesión lo leen **varios sitios a la vez** (las dos
guardas de ruta y las páginas). Si viviera en un `useState` de un componente, se perdería al
desmontarlo. Hace falta algo **fuera de React** que guarde un valor y **avise cuando cambie**.

**Cómo, línea a línea:**
- **`AuthState`**: los tres estados posibles, como **unión discriminada** por `kind`.
  - `CheckingAuthState`: la app acaba de arrancar y todavía no ha mirado si hay sesión guardada.
  - `AuthenticatedAuthState`: hay sesión. **Solo este estado tiene `session`.**
  - `UnauthenticatedAuthState`: no hay sesión.
- **`AuthStoreState`**: todo lo que guarda el store. **El dato** (`auth`) y **las acciones** que lo
  cambian (`setSession`, `clearSession`). En Zustand, datos y acciones van en el mismo objeto.
- **`StoreApi<AuthStoreState>`**: el tipo del store ya creado. Tiene `getState()` para leer (y
  llamar a las acciones) y `subscribe()` para enterarse de los cambios.
- **`createStore<AuthStoreState>()(...)`**: fíjate en los **dos paréntesis**. El primero recibe el
  tipo y el segundo, la función que crea el store. Es la forma que pide Zustand para que TypeScript
  infiera bien los tipos. **No es un error.**
- **`(set) => ({ ... })`**: Zustand te da `set`, la función para cambiar el estado. Devuelves el
  estado inicial y las acciones.
- **`set({ auth: ... })`**: sustituye `auth` y **deja el resto igual** (las acciones siguen ahí).
  Zustand **mezcla** el objeto nuevo con el anterior.
- **`createAuthStore`** es una **fábrica**: no crea el store al importar el fichero, sino cuando la
  llama `container.ts`.

**Por qué `zustand/vanilla` y no `create` de `zustand`:** `create` devuelve **un hook de React**, y
el núcleo no puede depender de React. `zustand/vanilla` crea el store **sin React**. Desde React se
lee con `useStore` (paso 9.1).

**Por qué una unión y no `{ isLoading: boolean; session?: AuthSession }`:** con booleanos puedes
llegar a combinaciones imposibles (cargando y con sesión a la vez). Con la unión **solo existen los
tres estados reales**, y TypeScript no deja leer `auth.session` sin comprobar antes el `kind`.

**Por qué existe `Checking`:** sin él, la app nacería como "sin sesión" y la guarda te mandaría a
`/login` durante un instante aunque tuvieras sesión guardada. Verías un parpadeo al recargar.

**Por qué el store no llama a los casos de uso:** el store **solo guarda**. Quien decide cuándo hay
sesión son los casos de uso, que reciben el store y llaman a `setSession` o `clearSession`.

**Diferencia con el Bloc del backoffice:** el Bloc guardaba el estado **y** llamaba a los casos de
uso. Aquí se separa: **el store guarda, los casos de uso deciden**.
**Lo que se pierde:** `setSession` es público; el Bloc de la primera versión tenía `changeState`
protegido. Por eso existe la convención A.7.6: **React solo lee el store**.

**Equivalente en Nest:** un provider singleton con un valor dentro, que además avisa a quien esté
escuchando cuando el valor cambia.

### 6.2 `src/core/modules/auth/app/LoginUseCase.ts`

```ts
import type { UseCase } from '@/core/lib';

import type { LoginCredentials } from '../domain/AuthCredentials';
import type { AuthRepository } from '../domain/AuthRepository';
import type { AuthSessionStorage } from '../domain/AuthSessionStorage';
import type { AuthStore } from './authStore';

interface LoginUseCaseProps {
  authRepository: AuthRepository;
  authSessionStorage: AuthSessionStorage;
  authStore: AuthStore;
}

export class LoginUseCase implements UseCase<LoginCredentials, void> {
  private readonly authRepository: AuthRepository;
  private readonly authSessionStorage: AuthSessionStorage;
  private readonly authStore: AuthStore;

  constructor({
    authRepository,
    authSessionStorage,
    authStore,
  }: LoginUseCaseProps) {
    this.authRepository = authRepository;
    this.authSessionStorage = authSessionStorage;
    this.authStore = authStore;
  }

  async execute(credentials: LoginCredentials): Promise<void> {
    const session = await this.authRepository.login(credentials);
    this.authSessionStorage.save(session);
    this.authStore.getState().setSession(session);
  }
}
```

**Cómo:**
- Sus dependencias van **tipadas con los puertos** (interfaces), nunca con clases concretas.
- El constructor recibe **un objeto** y lo desestructura. Los campos se asignan a mano.
- `execute`: pide el login → guarda la sesión en disco → avisa al store.
- **Si `login` lanza**, el `await` lanza en esa misma línea y **las dos siguientes no se ejecutan**.
  No hace falta `try/catch`: el error sube solo hasta TanStack Query.

**Por qué el caso de uso coordina tres piezas:** "iniciar sesión" significa **pedir el token,
guardarlo y marcar la app como autenticada**. Esa regla es de la aplicación, no de axios, ni de
`localStorage`, ni de React.

**Por qué devuelve `void`:** quien necesita la sesión la lee del store. No hace falta devolverla.

**Equivalente en Nest:** la **inyección por constructor** de siempre, pero sin decoradores. Aquí los
`new` se hacen en `container.ts`.

**Ejemplo:** contraseña mala → el backend responde 401 → `HttpClient` lanza
`Error('Invalid credentials')` → no se guarda nada y el store no cambia → la página muestra el
mensaje.

### 6.3 `src/core/modules/auth/app/RegisterUseCase.ts`

```ts
import type { UseCase } from '@/core/lib';

import type { RegisterData } from '../domain/AuthCredentials';
import type { AuthRepository } from '../domain/AuthRepository';

interface RegisterUseCaseProps {
  authRepository: AuthRepository;
}

export class RegisterUseCase implements UseCase<RegisterData, void> {
  private readonly authRepository: AuthRepository;

  constructor({ authRepository }: RegisterUseCaseProps) {
    this.authRepository = authRepository;
  }

  async execute(data: RegisterData): Promise<void> {
    await this.authRepository.register(data);
  }
}
```

**Por qué el `await` es imprescindible:** sin él, la promesa se quedaría suelta y el error no
llegaría a la página.
**Por qué no hace login también:** una clase, una operación. Encadenar "registrarse y entrar" es una
decisión de **flujo de pantalla**, y la toma el hook `useRegister` (paso 9.3).

### 6.4 `src/core/modules/auth/app/LogoutUseCase.ts`

```ts
import type { UseCase } from '@/core/lib';

import type { AuthSessionStorage } from '../domain/AuthSessionStorage';
import type { AuthStore } from './authStore';

interface LogoutUseCaseProps {
  authSessionStorage: AuthSessionStorage;
  authStore: AuthStore;
}

export class LogoutUseCase implements UseCase<void, void> {
  private readonly authSessionStorage: AuthSessionStorage;
  private readonly authStore: AuthStore;

  constructor({ authSessionStorage, authStore }: LogoutUseCaseProps) {
    this.authSessionStorage = authSessionStorage;
    this.authStore = authStore;
  }

  async execute(): Promise<void> {
    this.authSessionStorage.clear();
    this.authStore.getState().clearSession();
  }
}
```

**Por qué `async` si no hay `await`:** el contrato `UseCase` dice que siempre devuelve `Promise`. Si
mañana el logout también avisa al backend, la firma no cambia.
**Por qué no llama al backend:** la API no tiene endpoint de logout. Con JWT, cerrar sesión en el
cliente es olvidar el token.
**Quién lo usa:** el botón de la Home **y** el `HttpClient` cuando llega un 401. Como la lógica está
aquí, no se repite en dos sitios.

### 6.5 `src/core/modules/auth/app/RestoreSessionUseCase.ts`

```ts
import type { UseCase } from '@/core/lib';

import type { AuthSessionStorage } from '../domain/AuthSessionStorage';
import type { AuthStore } from './authStore';

interface RestoreSessionUseCaseProps {
  authSessionStorage: AuthSessionStorage;
  authStore: AuthStore;
}

export class RestoreSessionUseCase implements UseCase<void, void> {
  private readonly authSessionStorage: AuthSessionStorage;
  private readonly authStore: AuthStore;

  constructor({ authSessionStorage, authStore }: RestoreSessionUseCaseProps) {
    this.authSessionStorage = authSessionStorage;
    this.authStore = authStore;
  }

  async execute(): Promise<void> {
    const session = this.authSessionStorage.get();

    if (!session || session.expiresAt <= Date.now()) {
      this.authSessionStorage.clear();
      this.authStore.getState().clearSession();
      return;
    }

    this.authStore.getState().setSession(session);
  }
}
```

**Por qué existe:** para que al pulsar F5 sigas dentro. Se llama **una vez al arrancar** y saca al
store de `Checking`.

**Cómo:** si no hay sesión guardada **o** ya ha caducado, borra lo que hubiera y marca la app como
"sin sesión". Si es válida, la mete en el store.

**Es el ejemplo perfecto de por qué hacen falta los casos de uso:** "una sesión caducada no cuenta"
es una **regla de la aplicación**. No es trabajo de `localStorage` (que solo guarda), ni de Zustand
(que solo recuerda), ni de React (que solo pinta).

---

## PASO 7 — Módulo `auth`, capa `infra`

### 7.1 `src/core/modules/auth/infra/AuthDTO.ts`

```ts
export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  auth: {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
  };
}

export interface RegisterRequestDTO {
  username: string;
  email: string;
  password: string;
}
```

**Cómo:** son **copias exactas** de lo que usa el backend.
- `LoginRequestDTO` = `AuthPublicLoginDto`.
- `LoginResponseDTO` = `AuthPublicLoginResponse`. **La respuesta viene envuelta en `auth`.**
- `RegisterRequestDTO` = `UserCreateDto` sin `role`.

**Por qué copias exactas:** el DTO es "lo que dice el backend". Si el backend cambia, **solo cambian
este fichero y el mapper**. **Antes de escribir un DTO, mira el fichero real del backend.**

### 7.2 `src/core/modules/auth/infra/AuthMapper.ts`

```ts
import type { LoginCredentials, RegisterData } from '../domain/AuthCredentials';
import type { AuthSession } from '../domain/AuthSession';
import type {
  LoginRequestDTO,
  LoginResponseDTO,
  RegisterRequestDTO,
} from './AuthDTO';

export const AuthMapper = {
  toAuthSession: (dto: LoginResponseDTO): AuthSession => ({
    accessToken: dto.auth.accessToken,
    expiresAt: Date.now() + dto.auth.expiresIn * 1000,
  }),

  toLoginRequestDTO: (credentials: LoginCredentials): LoginRequestDTO => ({
    email: credentials.email,
    password: credentials.password,
  }),

  toRegisterRequestDTO: (data: RegisterData): RegisterRequestDTO => ({
    username: data.username,
    email: data.email,
    password: data.password,
  }),
};
```

**Cómo:**
- **`toAuthSession`**: DTO → dominio. Saca el token de dentro de `auth`, **ignora `tokenType`** y
  convierte `expiresIn` (segundos desde ahora) en `expiresAt`. `* 1000` porque `Date.now()` va en
  milisegundos y el backend manda segundos.
- La sintaxis `=> ({ ... })` lleva paréntesis porque, sin ellos, las llaves serían el cuerpo de la
  función y no un objeto.

**Por qué es la aduana:** es **el único sitio** donde se traducen nombres, formas y unidades.

**Por qué campo a campo y no `{ ...data }`:** si mañana añades `confirmPassword` al formulario, con
el spread se enviaría al backend y el `ValidationPipe` con `forbidNonWhitelisted: true` respondería
**400**.

### 7.3 `src/core/modules/auth/infra/AuthHTTPRepository.ts` — ADAPTADOR

```ts
import type { HttpClient } from '@/core/modules/common';

import type { LoginCredentials, RegisterData } from '../domain/AuthCredentials';
import type { AuthRepository } from '../domain/AuthRepository';
import type { AuthSession } from '../domain/AuthSession';
import type { LoginResponseDTO } from './AuthDTO';
import { AuthMapper } from './AuthMapper';

interface AuthHTTPRepositoryProps {
  httpClient: HttpClient;
}

export class AuthHTTPRepository implements AuthRepository {
  private readonly httpClient: HttpClient;

  constructor({ httpClient }: AuthHTTPRepositoryProps) {
    this.httpClient = httpClient;
  }

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const data = await this.httpClient.post<LoginResponseDTO>(
      '/auth/login',
      AuthMapper.toLoginRequestDTO(credentials),
    );
    return AuthMapper.toAuthSession(data);
  }

  async register(data: RegisterData): Promise<void> {
    await this.httpClient.post('/users', AuthMapper.toRegisterRequestDTO(data));
  }
}
```

**Cómo:**
- **`implements AuthRepository`**: se compromete a cumplir el puerto. Si falta un método o un tipo no
  cuadra, TypeScript da error **aquí**.
- **Imports**: `AuthMapper` es un **valor** (lo llamas); todo lo demás solo se usa como tipo.
  `HttpClient` es una clase, pero aquí nadie hace `new`.
- **`login`**: traduce las credenciales a DTO, hace la petición y traduce la respuesta a dominio.
- **`register`** hace `POST /users` (el `UserPublicController`). No devuelve nada.

**Por qué no hay `try/catch`:** el `HttpClient` ya entrega el error traducido. Este fichero no tiene
nada que hacer con él.

**Por qué las URLs están aquí:** son detalles del backend, y los detalles del backend solo los conoce
`infra`.

### 7.4 `src/core/modules/auth/infra/LocalSessionStorage.ts` — ADAPTADOR

```ts
import type { AuthSession } from '../domain/AuthSession';
import type { AuthSessionStorage } from '../domain/AuthSessionStorage';

const STORAGE_KEY = 'star-words-session';

export class LocalSessionStorage implements AuthSessionStorage {
  save(session: AuthSession): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  get(): AuthSession | null {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    try {
      return JSON.parse(saved) as AuthSession;
    } catch {
      this.clear();
      return null;
    }
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
```

**Cómo:**
- `localStorage` solo guarda **texto**: `JSON.stringify` al guardar y `JSON.parse` al leer.
- `as AuthSession` es necesario porque `JSON.parse` devuelve `any`.
- **`try/catch`**: si alguien ha tocado el valor a mano y ya no es JSON válido, borramos lo corrupto
  y devolvemos `null` en vez de romper la app. `catch {` sin `(error)` porque no se usa. Es el
  **único `try/catch` de la app**, y está aquí porque este error **sí se puede resolver**.

**Por qué `localStorage` y no `sessionStorage` (que usa el backoffice):** `sessionStorage` se borra al
cerrar la pestaña. **Lo que hay que saber:** cualquier JavaScript de la página puede leer
`localStorage`; con una vulnerabilidad XSS podrían robar el token. Lo más seguro son cookies
`httpOnly`, pero requieren cambios en el backend.

**Aquí se ve el hexágono:** para pasar a `sessionStorage`, cambias una línea de este fichero y
**ningún caso de uso se entera**.

### 7.5 `src/core/modules/auth/index.ts`

```ts
export * from './app/authStore';
export * from './app/LoginUseCase';
export * from './app/LogoutUseCase';
export * from './app/RegisterUseCase';
export * from './app/RestoreSessionUseCase';
export * from './domain/AuthCredentials';
export * from './domain/AuthRepository';
export * from './domain/AuthSession';
export * from './domain/AuthSessionStorage';
export * from './infra/AuthHTTPRepository';
export * from './infra/LocalSessionStorage';
```

**Cómo:** la **puerta única** del módulo. Desde fuera se importa `@/core/modules/auth`.

**Por qué no se exportan el DTO ni el mapper:** son **detalles internos** del adaptador. Si no están
en el barrel, a nadie se le ocurre importarlos.

**Por qué dentro del módulo no se usa este barrel:** si `LoginUseCase.ts` importara de `'..'` (este
`index.ts`), y este `index.ts` importa `LoginUseCase.ts`, habría una **importación circular**. Por eso
dentro del módulo se importa directamente del fichero.

---

## PASO 8 — `src/core/di/container.ts`

```ts
import { config } from '@/core/config';
import {
  AuthHTTPRepository,
  createAuthStore,
  LocalSessionStorage,
  LoginUseCase,
  LogoutUseCase,
  RegisterUseCase,
  RestoreSessionUseCase,
} from '@/core/modules/auth';
import { HttpClient } from '@/core/modules/common';

export const authStore = createAuthStore();
const authSessionStorage = new LocalSessionStorage();

export const logoutUseCase = new LogoutUseCase({
  authSessionStorage,
  authStore,
});

const httpClient = new HttpClient({
  baseUrl: config.apiUrl,
  getToken: () => authSessionStorage.get()?.accessToken ?? null,
  onUnauthorized: () => void logoutUseCase.execute(),
});

const authRepository = new AuthHTTPRepository({ httpClient });

export const loginUseCase = new LoginUseCase({
  authRepository,
  authSessionStorage,
  authStore,
});
export const registerUseCase = new RegisterUseCase({ authRepository });
export const restoreSessionUseCase = new RestoreSessionUseCase({
  authSessionStorage,
  authStore,
});
```

**Qué es:** el **composition root**, el **único sitio donde se crean** las piezas del núcleo y donde
se decide qué adaptador va en cada puerto.

**Cómo:**
- **El orden importa:** cada pieza se crea **después** de las que necesita. `logoutUseCase` va antes
  que `httpClient` porque `onUnauthorized` lo usa.
- `getToken`: `?.` significa "si `get()` devuelve `null`, no sigas"; `?? null` convierte el
  `undefined` resultante en `null`.
- `onUnauthorized`: `void` indica que ignoramos a propósito la promesa de `execute()`.
- **Se exportan el store y los casos de uso**, que es lo que React necesita. El `httpClient`, el
  repositorio y el storage **no se exportan**: React no tiene por qué verlos.

**Aquí se decide el hexágono:** `LoginUseCase` pide "un `AuthRepository`" y **aquí se le da un
`AuthHTTPRepository`**.

**Por qué los objetos se crean una sola vez:** un módulo de JavaScript se ejecuta **una única vez**,
aunque lo importen veinte ficheros. Todos reciben **el mismo** `authStore`. Es un singleton, igual
que los providers por defecto de Nest.

**Equivalente en Nest:** lo que hacen los `@Module({ providers: [...] })`, pero a mano. **Esto es lo
que hace Awilix en el backoffice**: con 18 módulos compensa automatizarlo; con uno, unas pocas líneas
de `new` se entienden mejor.

---

## PASO 9 — `src/app/hooks`: el puente entre React y el núcleo

### 9.1 `src/app/hooks/useAuthState.ts`

```ts
import { useStore } from 'zustand';

import { authStore } from '@/core/di/container';

export const useAuthState = () => useStore(authStore, (state) => state.auth);
```

**El problema:** el store avisa cuando cambia, pero React no se entera solo.

**Cómo:**
- **`useStore(store, selector)`** es el hook de Zustand para leer un store creado con
  `zustand/vanilla`. Se suscribe al store y **vuelve a pintar el componente** cuando cambia lo que
  devuelve el selector.
- **`(state) => state.auth`** es el **selector**: de todo el store, a este componente solo le
  interesa `auth`. Si cambiara otra cosa del store, este componente no se volvería a pintar.
- Por dentro, Zustand usa `useSyncExternalStore`, **el hook oficial de React para leer datos que
  viven fuera de React**.

**Por qué devuelve solo `auth` y no las acciones:** por la convención A.7.6. React **lee**; quien
**escribe** son los casos de uso.

**Uso:**
```ts
const authState = useAuthState();
if (authState.kind === 'AuthenticatedAuthState') { ... }
```

**Diferencia con el backoffice:** allí `useBlocState` está hecho a mano con `useState` + `useEffect`
y tiene un fallo sutil: si el Bloc cambia **entre** el primer render y la suscripción, ese cambio se
pierde. Zustand ya resuelve eso.

### 9.2 `src/app/hooks/useLogin.ts`

```ts
import { useMutation } from '@tanstack/react-query';

import { loginUseCase } from '@/core/di/container';
import type { LoginCredentials } from '@/core/modules/auth';

export const useLogin = () =>
  useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      loginUseCase.execute(credentials),
  });
```

**Cómo:**
- **`useMutation`** es el hook de TanStack Query para operaciones que **cambian algo** (POST, PUT,
  DELETE).
- **`mutationFn`** es la función que se ejecuta. Aquí solo llama al caso de uso.
- El hook devuelve un objeto con todo lo que necesita la pantalla:
  - **`mutate(credentials)`** → lanza la operación.
  - **`isPending`** → `true` mientras espera respuesta.
  - **`error`** → el `Error` si falló, o `null`.
  - **`isSuccess`** → `true` si fue bien.
- Si `mutationFn` lanza, TanStack Query **captura el error él solo** y lo deja en `error`.

**Por qué:** sin TanStack Query, cada página necesitaría su `useState` de "enviando", su `useState`
de error y su `try/catch/finally`. Con `useMutation`, **todo eso viene hecho y siempre igual**.

**Por qué el hook no sabe de axios:** llama al **caso de uso**, no al repositorio. TanStack Query es
un **adaptador primario**: conecta lo que hace el usuario con el núcleo.

**Diferencia con el backoffice:** allí la página hace `try { await activityBloc.createActivity(v) }
catch { snackbarError() }` y gestiona a mano el estado de "enviando".

**Ojo:** las mutations **no se reintentan** por defecto. Un login fallido no se repite solo.

### 9.3 `src/app/hooks/useRegister.ts`

```ts
import { useMutation } from '@tanstack/react-query';

import { loginUseCase, registerUseCase } from '@/core/di/container';
import type { RegisterData } from '@/core/modules/auth';

export const useRegister = () =>
  useMutation({
    mutationFn: async (data: RegisterData) => {
      await registerUseCase.execute(data);
      await loginUseCase.execute({ email: data.email, password: data.password });
    },
  });
```

**Cómo:** registra y, si va bien, **entra directamente** con el mismo email y contraseña. Si el
registro falla, el primer `await` lanza y el login no se intenta.

**Por qué aquí y no en un caso de uso:** "después de registrarte, entras" es una decisión de **flujo
de pantalla**. Otra pantalla (por ejemplo, un admin creando usuarios) registraría sin hacer login.

---

## PASO 10 — `ui/atoms`

### 10.1 `src/ui/atoms/Button.tsx`

```tsx
import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ type = 'button', ...props }: ButtonProps) => (
  <button
    type={type}
    className="w-full rounded-md bg-yellow-400 px-4 py-2 font-semibold text-black transition-colors hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
    {...props}
  />
);
```

**Cómo:**
- **`ButtonHTMLAttributes<HTMLButtonElement>`**: el tipo con **todas** las props de un `<button>`
  (`onClick`, `disabled`, `children`…).
- **`{...props}`**: pasa al `<button>` real todo lo recibido.
- **Clases:** `w-full` ancho completo · `rounded-md` bordes redondeados · `bg-yellow-400 text-black`
  amarillo con texto negro · `px-4 py-2` relleno · `hover:bg-yellow-300` al pasar el ratón ·
  `transition-colors` cambio suave · `disabled:*` aspecto desactivado.

**Por qué `type = 'button'` por defecto:** en HTML, un `<button>` dentro de un `<form>` es de tipo
**submit** si no dices nada, así que cualquier botón enviaría el formulario.

### 10.2 `src/ui/atoms/TextField.tsx`

```tsx
import { useId, type InputHTMLAttributes } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const TextField = ({ label, ...inputProps }: TextFieldProps) => {
  const id = useId();

  return (
    <div className="flex flex-col gap-1 text-left">
      <label htmlFor={id} className="text-sm text-gray-300">
        {label}
      </label>
      <input
        id={id}
        className="rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white outline-none focus:border-yellow-400"
        {...inputProps}
      />
    </div>
  );
};
```

**Cómo:**
- **`extends InputHTMLAttributes<HTMLInputElement>`**: acepta todo lo de un `<input>` **más** `label`.
- **`useId()`**: id único. Si hay dos `TextField` en la página, cada uno tiene el suyo.
- **`htmlFor` + `id`**: conecta etiqueta y campo (al pulsar la etiqueta el cursor va al input, y los
  lectores de pantalla leen "Email"). En JSX es `htmlFor` porque `for` es palabra reservada.

**Por qué etiqueta e input juntos:** un input sin etiqueta es un problema de accesibilidad; así es
**imposible olvidarla**.

### 10.3 `src/ui/atoms/index.ts`

```ts
export * from './Button';
export * from './TextField';
```

---

## PASO 11 — `ui/organisms`

### 11.1 `src/ui/organisms/LoginForm.tsx`

```tsx
import { useState, type SubmitEvent } from 'react';

import type { LoginCredentials } from '@/core/modules/auth';
import { Button, TextField } from '@/ui/atoms';

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void;
  isSubmitting: boolean;
}

export const LoginForm = ({ onSubmit, isSubmitting }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <TextField
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
};
```

**Cómo:**
- El formulario recibe **dos props**: qué hacer al enviar y si se está enviando. **No sabe que
  existen TanStack Query ni el store.**
- **Inputs controlados**: `value` muestra el estado y `onChange` lo actualiza con cada tecla. El
  estado de React es la **única fuente de verdad**.
- **`SubmitEvent<HTMLFormElement>`**: el tipo del evento de envío. **No uses `FormEvent`**: en los
  tipos de React 19.2 está marcado como obsoleto.
- **`event.preventDefault()`**: **imprescindible**, o el formulario recarga la página.
- **`isSubmitting` llega de fuera** (de `isPending`). Ya no hay `useState` de "enviando" ni
  `try/finally` dentro del formulario.
- **Validación nativa**: `required` y `type="email"`. Si falla, **el navegador avisa y `onSubmit` ni
  se ejecuta**.
- **`autoComplete`**: para que el gestor de contraseñas rellene.

**Por qué el formulario no llama a `useLogin`:** **solo las páginas hablan con los hooks del núcleo**.
Así el formulario solo recoge datos y se podría reutilizar con otra lógica, igual que un controller
de Nest no sabe de TypeORM.

**Diferencia con el backoffice:** allí `LoginForm` usa `useCradle()` y llama a `authBloc.login()`
directamente, rompiendo su propia regla; además usa Formik y Yup, que para dos campos no hacen falta.

### 11.2 `src/ui/organisms/RegisterForm.tsx`

```tsx
import { useState, type SubmitEvent } from 'react';

import type { RegisterData } from '@/core/modules/auth';
import { Button, TextField } from '@/ui/atoms';

interface RegisterFormProps {
  onSubmit: (data: RegisterData) => void;
  isSubmitting: boolean;
}

export const RegisterForm = ({ onSubmit, isSubmitting }: RegisterFormProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ username, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField
        label="Nombre de usuario"
        autoComplete="username"
        required
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <TextField
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        required
        minLength={4}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
      </Button>
    </form>
  );
};
```

**Diferencias con `LoginForm`:**
- **`minLength={4}`**: la misma regla que el backend (`@MinLength(4)` en `UserCreateDto`).
- **`autoComplete="new-password"`**: para que el navegador ofrezca generar una contraseña.

**Por qué repetir la validación si ya la hace el backend:** la del navegador es **comodidad**; la del
backend es **seguridad**, porque cualquiera puede saltarse el navegador con Postman.

### 11.3 `src/ui/organisms/index.ts`

```ts
export * from './LoginForm';
export * from './RegisterForm';
```

---

## PASO 12 — Páginas y guardas

### 12.1 `src/app/pages/LoginPage.tsx`

```tsx
import { Link } from 'react-router-dom';

import { useLogin } from '@/app/hooks/useLogin';
import { LoginForm } from '@/ui/organisms';

export const LoginPage = () => {
  const login = useLogin();

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4">
      <section className="w-full max-w-sm rounded-xl border border-gray-800 bg-gray-950 p-8">
        <h1 className="mb-6 text-center text-3xl font-bold text-yellow-400">
          Star Words
        </h1>

        {login.error && (
          <p
            role="alert"
            className="mb-4 rounded-md bg-red-950 px-3 py-2 text-sm text-red-300"
          >
            {login.error.message}
          </p>
        )}

        <LoginForm
          onSubmit={(credentials) => login.mutate(credentials)}
          isSubmitting={login.isPending}
        />

        <p className="mt-6 text-center text-sm text-gray-400">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-yellow-400 hover:underline">
            Regístrate
          </Link>
        </p>
      </section>
    </main>
  );
};
```

**Cómo:**
- **`const login = useLogin()`**: todo lo que la pantalla necesita del login está en ese objeto.
- **`login.mutate(credentials)`**: lanza el login. **No lleva `await` ni `try/catch`**: el resultado
  llega a `login.isPending` y `login.error`, y React vuelve a pintar solo.
- **`{login.error && (...)}`**: si hay error lo pinta; si es `null`, no pinta nada.
  `role="alert"` hace que los lectores de pantalla lo anuncien.
- **Al volver a enviar**, TanStack Query pone `error` a `null` automáticamente. No hay que limpiarlo
  a mano.
- **`<Link to="/register">`** navega **sin recargar**. No uses `<a href>`.
- **`{' '}`** fuerza un espacio que JSX se comería.

**"¿Por qué no hay `navigate('/')` después del login?":** porque `/login` está envuelta en
`GuestRoute`, que **lee el store**. Cuando `LoginUseCase` hace `setSession`, la guarda redirige sola.
**La página no decide a dónde vas: el estado lo decide.**

**Diferencia con la primera versión de la guía:** antes había `useState` para el error, un
`try/catch` y una función `getErrorMessage`. Ahora todo eso lo hace `useMutation`.

### 12.2 `src/app/pages/RegisterPage.tsx`

```tsx
import { Link } from 'react-router-dom';

import { useRegister } from '@/app/hooks/useRegister';
import { RegisterForm } from '@/ui/organisms';

export const RegisterPage = () => {
  const register = useRegister();

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4">
      <section className="w-full max-w-sm rounded-xl border border-gray-800 bg-gray-950 p-8">
        <h1 className="mb-6 text-center text-3xl font-bold text-yellow-400">
          Crear cuenta
        </h1>

        {register.error && (
          <p
            role="alert"
            className="mb-4 rounded-md bg-red-950 px-3 py-2 text-sm text-red-300"
          >
            {register.error.message}
          </p>
        )}

        <RegisterForm
          onSubmit={(data) => register.mutate(data)}
          isSubmitting={register.isPending}
        />

        <p className="mt-6 text-center text-sm text-gray-400">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-yellow-400 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </section>
    </main>
  );
};
```

**Mensajes de error que puedes ver:**
- **422** → `The email of new user exists`.
- **500** → `Internal server error`: ver la trampa nº 2 (nombre de usuario repetido).
- **400** → los textos del `ValidationPipe`.

**Por qué no redirige tras registrarse:** `useRegister` hace login al terminar, el store pasa a
`Authenticated` y `GuestRoute` lleva a `/`.

### 12.3 `src/app/pages/HomePage.tsx`

```tsx
import { logoutUseCase } from '@/core/di/container';
import { Button } from '@/ui/atoms';

export const HomePage = () => (
  <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black px-4">
    <h1 className="text-4xl font-bold text-yellow-400">Star Words</h1>
    <div className="w-full max-w-xs">
      <Button onClick={() => void logoutUseCase.execute()}>Cerrar sesión</Button>
    </div>
  </main>
);
```

**Por qué existe:** hace falta **un destino** después de entrar y así se puede probar el logout. Aquí
irá luego el explorador de Star Wars.
**Por qué el logout no usa `useMutation`:** no llama al backend y no puede fallar, así que no hay
estado de carga ni error que mostrar. Se llama al caso de uso directamente.
**Por qué tampoco hay `navigate('/login')`:** el caso de uso pasa el store a `Unauthenticated` y
`AuthRoute` saca al usuario solo.

### 12.4 `src/app/ProtectedRoutes.tsx`

```tsx
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuthState } from '@/app/hooks/useAuthState';

interface RouteGuardProps {
  children: ReactNode;
}

export const AuthRoute = ({ children }: RouteGuardProps) => {
  const authState = useAuthState();

  if (authState.kind === 'CheckingAuthState') return null;
  if (authState.kind === 'UnauthenticatedAuthState') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const GuestRoute = ({ children }: RouteGuardProps) => {
  const authState = useAuthState();

  if (authState.kind === 'CheckingAuthState') return null;
  if (authState.kind === 'AuthenticatedAuthState') {
    return <Navigate to="/" replace />;
  }
  return children;
};
```

**Qué son:** componentes que **envuelven** una página y deciden si se muestra o si te redirigen.
**Equivalente en Nest:** el `JwtAuthGuard` y el decorador `@Public()`.

**Cómo:**
- **`children: ReactNode`**: la página que va dentro.
- **`useAuthState()`**: se suscribe al store, así que **cada cambio de sesión vuelve a evaluar la
  guarda**.
- **`Checking` → `return null`**: todavía no sabemos si hay sesión; redirigir ya provocaría un
  parpadeo hacia `/login`.
- **`replace`**: **sustituye** la entrada del historial. Sin él, al pulsar "atrás" quedarías atrapado
  en un bucle entre `/` y `/login`.

**Por qué en `app/` y no en `ui/`:** porque **leen el estado de la app**. Lo de `ui/` solo recibe
props.

---

## PASO 13 — Arrancar la app

### 13.1 `src/app/AppRoutes.tsx`

```tsx
import { Navigate, useRoutes, type RouteObject } from 'react-router-dom';

import { HomePage } from '@/app/pages/HomePage';
import { LoginPage } from '@/app/pages/LoginPage';
import { RegisterPage } from '@/app/pages/RegisterPage';
import { AuthRoute, GuestRoute } from '@/app/ProtectedRoutes';

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <AuthRoute>
        <HomePage />
      </AuthRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export const AppRoutes = () => useRoutes(routes);
```

**Cómo:** las rutas como **datos** (`RouteObject[]`), no como JSX. `path: '*'` manda cualquier URL
desconocida a `/`, y allí decide la guarda. `useRoutes(routes)` mira la URL actual y devuelve el
`element` que coincide.
**Por qué como array:** mismo estilo que el backoffice, y todas las rutas se ven de un vistazo.

### 13.2 `src/app/queryClient.ts`

```ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();
```

**Cómo:** el `QueryClient` es **la caché de TanStack Query**: guarda las respuestas y el estado de
cada query y mutation.

**Por qué en su propio fichero y fuera de cualquier componente:** tiene que crearse **una sola vez**.
Si lo crearas dentro de un componente, cada render crearía una caché nueva y vacía. Y en un fichero
aparte, mañana puedes usarlo desde otro sitio (por ejemplo, para borrar la caché al hacer logout).

### 13.3 `src/app/App.tsx`

```tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';

import { AppRoutes } from '@/app/AppRoutes';
import { queryClient } from '@/app/queryClient';

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
    <ReactQueryDevtools />
  </QueryClientProvider>
);
```

**Cómo:**
- **`QueryClientProvider`** pone la caché a disposición de toda la app. Sin él, `useMutation` y
  `useQuery` dan error. **Tiene que envolver** todo lo que use TanStack Query.
- **`BrowserRouter`** activa las rutas con la URL del navegador y **tiene que envolver** todo lo que
  use `useRoutes`, `Link` o `Navigate`.
- **`ReactQueryDevtools`** pinta un botón flotante abajo a la derecha para ver queries y mutations.
  **En producción no se pinta.**

**Por qué un fichero solo para esto:** `App` es el sitio de los **providers** globales.

**Fíjate:** el store de Zustand **no necesita provider**. Se lee con `useStore(authStore, ...)` desde
cualquier componente. Es una de las razones por las que es tan sencillo.

### 13.4 `src/main.tsx`

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import { App } from '@/app/App';
import { restoreSessionUseCase } from '@/core/di/container';

void restoreSessionUseCase.execute();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

**Cómo:**
- **`import './index.css'`**: import "por efecto", solo para que se aplique el CSS.
- **`void restoreSessionUseCase.execute()`**: **antes de pintar**, comprueba si hay sesión guardada.
  Mientras tanto el store está en `Checking` y las guardas no pintan nada.
- **`document.getElementById('root')!`**: el `<div id="root">` del `index.html`. El `!` dice "sé que
  existe".
- **`<StrictMode>`**: en desarrollo React ejecuta ciertas cosas dos veces para destapar errores.

**Por qué `restoreSession` aquí y no en un `useEffect`:** es algo que se hace **una vez al arrancar**,
y además con `StrictMode` un `useEffect` se ejecutaría dos veces en desarrollo.

---

## PASO 14 — Probarlo

1. **Reiniciar el backend** para que coja el `enableCors`.
2. En `frontend`: `pnpm dev` y abrir `http://localhost:5173`.

| Acción | Resultado esperado | Qué pieza lo hace |
|---|---|---|
| Abrir `/` sin sesión | Te manda a `/login` | `AuthRoute` |
| Login con contraseña mala | `Invalid credentials` | `HttpClient` → `login.error` |
| Pulsar "Entrar" | El botón pone "Entrando..." y se desactiva | `login.isPending` |
| Registrarte | Entras directamente a la Home | `useRegister` → `LoginUseCase` → `GuestRoute` |
| Registrarte con email repetido | `The email of new user exists` | 422 del backend |
| F5 en la Home | Sigues dentro | `RestoreSessionUseCase` + `LocalSessionStorage` |
| DevTools → Application → Local Storage | Aparece `star-words-session` | `LocalSessionStorage.save` |
| Botón flotante de TanStack Query | Ves la mutation del login y su estado | `ReactQueryDevtools` |
| Cerrar sesión | Vuelves a `/login` y la clave desaparece | `LogoutUseCase` + `AuthRoute` |
| Backend apagado + login | `No se puede conectar con el servidor` | `HttpClient` |

Comprobar tipos sin arrancar: `pnpm exec tsc -b`.

---

## Trampas conocidas

1. **CORS:** si en la consola sale `blocked by CORS policy`, el backend no se ha reiniciado tras el
   cambio en `main.ts`.
2. **Nombre de usuario repetido → error 500.** El `UserPublicController` comprueba que el email no
   exista, pero **no el username**. La base de datos lo rechaza por `unique: true` y Nest responde
   500. **El arreglo correcto está en el backend:** comprobar también el username (ya existe
   `checkEmailAndUsernameExists` en `user.service.ts`) y devolver 422.
3. **`import type` olvidado:** si Vite dice `does not provide an export named 'AuthRepository'`, es que
   importaste una interfaz sin `type`.
4. **`constructor(private readonly x)`:** da error con `erasableSyntaxOnly`. Declara el campo y
   asígnalo a mano.
5. **`FormEvent` tachado en el editor:** está obsoleto; usa `SubmitEvent`.
6. **Un selector de Zustand que devuelve un objeto nuevo.** `useStore(authStore, (s) => ({ auth: s.auth }))`
   crea un objeto distinto en cada render, React cree que ha cambiado y entra en bucle
   (`Maximum update depth exceeded`). **Devuelve siempre un valor que ya esté en el store**
   (`(s) => s.auth`).
7. **Olvidar el `QueryClientProvider`:** `useMutation` falla con `No QueryClient set`.
8. **Importar desde `'..'` dentro de un módulo:** crea una importación circular con el `index.ts` del
   módulo. Dentro, importa siempre del fichero (`'../domain/AuthSession'`).
9. **Llamar a `setSession` desde un componente:** funciona, pero se salta los casos de uso (no
   guardaría en `localStorage`). React solo **lee** el store.

---

## Resumen en cinco frases

1. **`domain`** dice qué es una sesión y **qué necesita** la app de fuera (puertos), sin tecnología.
2. **`app`** dice **qué sabe hacer** la app (casos de uso) y guarda el estado de la sesión en un
   store de Zustand que no sabe nada de React.
3. **`infra`** cumple los puertos con **axios y `localStorage`**, y `HttpClient` convierte cualquier
   fallo en un `Error` con un mensaje listo para enseñar.
4. **`container.ts`** es el único sitio que crea las piezas y **decide qué adaptador va en cada
   puerto**.
5. **React** usa **TanStack Query** para llamar a los casos de uso y **Zustand** para leer la sesión.
   Hasta la navegación después del login la decide el estado.

---

## Siguiente paso

### Listar personajes con `useQuery`

Cuando el login funcione, el módulo `character` seguirá la misma receta: `domain` (entidad + puerto)
→ `infra` (DTO + mapper + repositorio con `httpClient.get`) → caso de uso → `container.ts`. En React,
en vez de `useMutation` se usa **`useQuery`**, que es donde TanStack Query más brilla:

```ts
export const useCharacters = () =>
  useQuery({
    queryKey: ['characters'],
    queryFn: () => getCharactersUseCase.execute(),
  });
```

```tsx
const { data, status, error } = useCharacters();

if (status === 'pending') return <p>Cargando...</p>;
if (status === 'error') return <p role="alert">{error.message}</p>;
return <CharacterList characters={data} />;
```

**Lo que te da gratis:**
- **`status`** ya es una unión discriminada (`pending` / `error` / `success`), así que no hace falta
  crear estados `Loading` / `Loaded` / `Error` como en el backoffice.
- **Caché:** si sales y vuelves a la lista, se pinta al instante con los datos guardados y se
  refresca por detrás.
- **Reintentos:** si falla, lo reintenta 3 veces antes de dar error.
- **`queryKey`:** es el nombre de la caché. `['characters']` para la lista, `['characters', id]`
  para el detalle. Siempre del más general al más específico.

**En el backoffice** esto mismo es: un `CharacterBloc` con cuatro estados, un
`useEffect(() => { characterBloc.getCharacters() }, [])` en la página, `useBlocState` y un
`if (state.kind === 'LoadedCharactersState')`.

**Y Zustand**, más adelante, para estado propio de la app que no viene del backend (por ejemplo,
filtros o un modo de vista).

### Reescribir `frontend/CLAUDE.md`

Hoy describe otra arquitectura (carpetas `presentation/` e `infrastructure/`, sin casos de uso,
`Either` y Bloc prohibidos) y **ya no coincide con esta guía**.
