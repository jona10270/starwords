# Ticket de Proyecto: API REST — Star Wars Explorer (Backend)

**Tipo:** Feature completa (Sprint de 1 semana)
**Stack:** NestJS + TypeScript + TypeORM + PostgreSQL
**Prioridad:** Alta
**Estimación:** 7 días · 3-4h/día (21-28h totales)
**Entregable de esta fase:** API funcional documentada por este mismo ticket (sin frontend, sin Docker, sin tests automatizados, sin Swagger)

---

## 1. Contexto y objetivo

Se necesita una API REST que actúe como capa intermedia sobre **SWAPI** (https://swapi.info/api), añadiendo:

- Autenticación de usuarios propia
- Caché de las respuestas de SWAPI (para no depender de su disponibilidad ni latencia en cada petición)
- Funcionalidad propia de negocio: favoritos y filtrado avanzado sobre los datos de SWAPI

El frontend (React) se abordará en el siguiente sprint, una vez la API esté cerrada y estable. Esta API debe poder consumirse perfectamente con Postman/Insomnia sin necesidad de UI.

---

## 2. Reglas del proyecto

- **No** se usa Docker en esta fase. Todo corre local (Node + Postgres instalados en la máquina).
- **No** se escriben tests automatizados en esta fase.
- **No** se documenta con Swagger — este documento es la documentación de referencia.
- Sí se exige: validación de inputs (DTOs), manejo de errores centralizado y rate limiting.
- Cada día tiene una **Definition of Done (DoD)**. Si al final del día no se cumple, no se avanza al siguiente bloque.

---

## 3. Stack técnico y librerías

| Área | Elección |
|---|---|
| Framework | NestJS (sobre Express por debajo) |
| Lenguaje | TypeScript |
| Base de datos | PostgreSQL |
| ORM | TypeORM (integración nativa con `@nestjs/typeorm`) |
| Auth | `@nestjs/jwt` + `@nestjs/passport` + `bcrypt` |
| Caché | `@nestjs/cache-manager` (en memoria) |
| Validación | `class-validator` + `class-transformer` vía DTOs |
| Rate limiting | `@nestjs/throttler` |
| Cliente HTTP a SWAPI | `@nestjs/axios` |

---

## 4. Modelo de datos

```
User
 - id            PK
 - email         string, único
 - password_hash string
 - created_at    timestamp

Favorite
 - id             PK
 - user_id        FK -> User
 - resource_type  enum: 'people' | 'planets' | 'starships'
 - resource_id    string (id del recurso en SWAPI)
 - resource_name  string (cacheado, evita ir a pedir el nombre a SWAPI cada vez)
 - created_at     timestamp
```

---

## 5. Estructura de módulos (NestJS)

```
src/
 ├── auth/
 │    ├── auth.module.ts
 │    ├── auth.controller.ts
 │    ├── auth.service.ts
 │    ├── dto/register.dto.ts
 │    ├── dto/login.dto.ts
 │    ├── guards/jwt-auth.guard.ts
 │    └── strategies/jwt.strategy.ts
 ├── users/
 │    ├── users.module.ts
 │    ├── users.service.ts
 │    └── entities/user.entity.ts
 ├── personajes/
 │    ├── personajes.module.ts
 │    ├── personajes.controller.ts
 │    ├── personajes.service.ts      (llamadas a SWAPI + caché + filtrado)
 │    └── dto/filtrar-personajes.dto.ts
 ├── favoritos/
 │    ├── favoritos.module.ts
 │    ├── favoritos.controller.ts
 │    ├── favoritos.service.ts
 │    ├── dto/create-favorito.dto.ts
 │    └── entities/favorite.entity.ts
 ├── app.module.ts
 └── main.ts
```

---

## 6. Endpoints requeridos (contrato final)

### Auth (públicos)
- `POST /auth/register` → `{ email, password }` → `201` con `{ id, email }`
- `POST /auth/login` → `{ email, password }` → `200` con `{ token }`

### Personajes (públicos, con caché)
- `GET /personajes` → lista paginada
- `GET /personajes/:id` → detalle
- `GET /personajes/buscar?nombre=` → búsqueda simple por nombre
- `GET /personajes/filtrar?especie=&pelicula=&altura_min=&altura_max=` → filtro combinado (ver Día 6)

### Favoritos (protegidos con `@UseGuards(JwtAuthGuard)`)
- `POST /favoritos` → `{ resource_type, resource_id }`
- `GET /favoritos` → lista de favoritos del usuario autenticado
- `DELETE /favoritos/:id`

---

## 7. Plan de ejecución día a día

### Día 1 — Setup + estructura de módulos
**Tareas:**
- `nest new` del proyecto, configurar conexión a PostgreSQL con `TypeOrmModule.forRoot()`
- Generar módulos vacíos: `auth`, `users`, `personajes`, `favoritos` (`nest g module ...`)
- Entidad `User` con TypeORM

**DoD:** El proyecto levanta con `npm run start:dev` sin errores, y la conexión a la BD queda confirmada en consola.

**Límite de tiempo:** 3-4h.

---

### Día 2 — Auth completo
**Tareas:**
- `RegisterDto` y `LoginDto` con `class-validator` (email válido, password mínimo 8 caracteres)
- `AuthService`: hash con bcrypt en registro, verificación en login, emisión de JWT
- `JwtStrategy` + `JwtAuthGuard` para proteger rutas
- `POST /auth/register` y `POST /auth/login` funcionando

**DoD:** Puedes registrar un usuario y hacer login obteniendo un token válido, probado en Postman. Un endpoint protegido de prueba rechaza peticiones sin token.

**Límite de tiempo:** 3-4h.

---

### Día 3 — Proxy + caché sobre SWAPI
**Tareas:**
- `PersonajesService`: llamadas a SWAPI con `HttpService` (`@nestjs/axios`)
- `GET /personajes`, `GET /personajes/:id`, `GET /personajes/buscar?nombre=`
- Integrar `CacheModule` (`@nestjs/cache-manager`) a nivel de service o con `@UseInterceptors(CacheInterceptor)` en el controller, TTL 24h

**DoD:** Las tres rutas responden correctamente y la segunda petición idéntica no llama a SWAPI (verificable midiendo tiempos de respuesta).

**Límite de tiempo:** 3-4h. Día más importante técnicamente.

---

### Día 4 — Favoritos
**Tareas:**
- Entidad `Favorite` con relación `ManyToOne` a `User`
- `CreateFavoritoDto` con validación
- `POST /favoritos`, `GET /favoritos`, `DELETE /favoritos/:id`, todos con `@UseGuards(JwtAuthGuard)` y usando el `user` del request (decorator `@Req()` o un decorator custom `@CurrentUser()`)

**DoD:** Un usuario puede añadir, listar y borrar sus propios favoritos, y no puede ver ni borrar los de otro usuario (probarlo con 2 usuarios distintos).

**Límite de tiempo:** 3-4h.

---

### Día 5 — Seguridad y validación
**Tareas:**
- `ThrottlerModule` global + límite más estricto en `/auth/login` con `@Throttle()`
- Repasar que todos los DTOs tengan validación completa (`ValidationPipe` global en `main.ts`)
- `ExceptionFilter` custom para respuestas de error consistentes, sin filtrar info sensible (ej. login nunca dice "el email no existe")

**DoD:** 10 logins fallidos seguidos bloquean temporalmente. Un body inválido en cualquier endpoint devuelve `400` con mensaje claro.

**Límite de tiempo:** 2-3h.

---

### Día 6 — Filtrado avanzado (funcionalidad estrella)
**Tareas:**
- `GET /personajes/filtrar?especie=&pelicula=&altura_min=&altura_max=`
- Cruzar datos de varios endpoints de SWAPI (personajes + especies + películas) y aplicar la lógica de filtrado en el `PersonajesService`, ya que SWAPI no lo soporta nativamente
- Reutilizar el caché del Día 3 para no penalizar rendimiento

**DoD:** Puedes combinar al menos 2 filtros a la vez y obtener un resultado correcto y coherente.

**Límite de tiempo:** 3-4h. Si necesitas robarle tiempo al Día 7, hazlo aquí.

---

### Día 7 — Colecciones personalizadas o colchón
**Tareas (si el Día 6 fue fluido):**
- Entidades `Collection` y `CollectionItem`
- `CollectionsModule` con `POST /colecciones`, `GET /colecciones`, `POST /colecciones/:id/items`, `DELETE /colecciones/:id/items/:itemId`

**Tareas (si el Día 6 se alargó):**
- Terminar y pulir el filtrado avanzado
- Repasar consistencia de respuestas de error en toda la API

**DoD:** O bien colecciones funcionando end-to-end, o bien el filtrado del Día 6 cerrado sin cabos sueltos.

**Límite de tiempo:** 3-4h.

---

## 8. Criterio de "sprint cerrado"

Al final de la semana, la API debe permitir esta demo completa sin tocar código:

1. Registrar usuario → login → obtener token
2. Listar personajes → buscar uno → filtrarlos por especie
3. Guardar 2 favoritos → listarlos → borrar uno
4. Intentar acceder a favoritos sin token → recibir `401`
5. (Si Día 7 fue colecciones) Crear una colección y meter un personaje dentro

Si los 4-5 puntos funcionan, el sprint está cerrado y se puede pasar a la semana de frontend en React.

---

## 9. Notas de seguimiento

- Si un día se completa en menos tiempo del estimado, no adelantes trabajo del día siguiente — revisa mejor casos borde del día actual.
- Si un día se pasa del límite de horas, anota brevemente por qué (disciplina real de entorno de trabajo: medir desviación contra estimación).
