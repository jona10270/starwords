# Star Words — Backend · Lo que falta

> Estado a **2026-09-06**. Cruce entre `guia-proyecto-backend-swapi_1.md` (el ticket del sprint) y el código actual.
> Marca `[x]` según los vayas cerrando.

---

## ✅ Ya hecho

- [x] Día 1 — Setup + conexión Postgres + estructura de módulos
- [x] Día 2 — Auth: registro (`POST /users`), login (`POST /auth/login`), JWT, `JwtAuthGuard` global
- [x] Día 3 — Proxy SWAPI: `people`, `films`, `planets`, `species`, `vehicles`, `starships` (all + `:id`)
- [x] Día 4 — `POST /favorites`, `GET /favorites` (+ paginación, que era extra)
- [x] Día 5 — `ThrottlerModule` global + `ValidationPipe` global en `main.ts`
- [x] Día 5 — Login no revela si el email existe (`DUMMY_HASH` + "Invalid credentials")

---

## ❌ Pendiente (en orden de prioridad de la guía)

### 1. Caché de SWAPI — Día 3 (DoD del día técnicamente más importante)

- [ ] Integrar `@nestjs/cache-manager` + `CacheModule` (caché en memoria)
- [ ] En `src/modules/starwars/common/swapi.service.ts`: mirar caché antes del `fetch`, guardar el resultado. TTL 24h.
- [ ] Alternativa: `@UseInterceptors(CacheInterceptor)` en `swapi.client.controller.ts`

**Por qué:** ahora `SwapiRequest.request()` hace un `fetch` a `swapi.info` en cada petición. Si SWAPI se cae o va lento, tu API también. La caché es el motivo de existir de esta capa intermedia.

**DoD:** la segunda petición idéntica NO llama a SWAPI (verificable midiendo tiempos).

---

### 2. `DELETE /favorites/:id` — Día 4 (DoD: "no puede borrar los de otro usuario")

- [ ] Método en `favorites.services.ts`:
  ```ts
  public async deleteFavoriteForUser(id: string, userId: string): Promise<FavoriteModel> {
      const favorite = await this.favoriteRepository.findOne({ where: { id, userId } });
      if (!favorite) throw new NotFoundException('The favorite does not exist');
      await this.favoriteRepository.delete(favorite.id);
      return favorite;
  }
  ```
- [ ] Endpoint en `favorites.controller.ts`:
  ```ts
  @Delete(':id')
  public async deleteFavorite(
      @Param('id', ParseUUIDPipe) id: string,
      @CurrentUser() user: UserModel,
  ): Promise<FavoriterResponse> {
      const favorite = await this.favoriteService.deleteFavoriteForUser(id, user.id);
      return new FavoriterResponse(favorite);
  }
  ```

**Clave:** `where: { id, userId }` con el `userId` del token, no del cliente. Si el favorito no es tuyo → 404 (no confirmas que existe). Esto evita el fallo IDOR.

---

### 3. Arreglar el `userId` del `POST /favorites` — Día 4

- [ ] `favorites.controller.ts` `addFavorite` coge `client.userId` del **body**. Debe salir de `@CurrentUser()`.
- [ ] Quitar `userId` de `FavoriteRequestDto` (`favorites.client.add.request.ts`).

**Por qué:** si el `userId` lo manda el cliente, puedo crear favoritos en la cuenta de otro. La identidad siempre del token.

---

### 4. `resource_name` cacheado en la entidad `Favorite` — Día 4 (modelo de datos de la guía)

- [ ] Migración nueva: `ALTER TABLE favorites ADD COLUMN "resourceName" varchar`
- [ ] Columna en `FavoritesEntity` + campo en `FavoriteModel`
- [ ] Al crear el favorito (`addFavorite`), guardar el nombre del recurso (ya se resuelve en `resourceExist`, aprovecharlo)
- [ ] Exponerlo en `FavoriteVM`

**Por qué:** la guía dice "cacheado, evita ir a pedir el nombre a SWAPI cada vez". Sin esto, para pintar la lista de favoritos con nombres el frontend hace una llamada a SWAPI por favorito.

---

### 5. `@Throttle()` estricto en `/auth/login` — Día 5 (DoD: "10 logins fallidos bloquean")

- [ ] `@Throttle({ default: { limit: 5, ttl: 60000 } })` en el método `login` de `auth.public.controller.ts`

**Por qué:** el throttler global permite 100/min, demasiado para login (fuerza bruta de contraseñas).

---

### 6. `ExceptionFilter` global — Día 5

- [ ] Filtro global que dé el mismo JSON a todos los errores: `{ statusCode, message, path, timestamp }`
- [ ] Registrarlo en `main.ts` (`app.useGlobalFilters(...)`)

**Por qué:** ahora cada excepción sale con el formato por defecto de Nest, inconsistente. El frontend necesita una forma de error única.

---

### 7. Búsqueda y filtrado de personajes — Día 6 ("funcionalidad estrella")

- [ ] `GET /starwars/people/search?name=` → búsqueda simple por nombre
- [ ] `GET /starwars/people/filter?species=&film=&height_min=&height_max=` → filtro combinado
- [ ] La lógica en `people.service.ts`: cruzar people + species + films en memoria (SWAPI no lo hace nativo)
- [ ] Reutilizar la caché del punto 1 para no penalizar rendimiento

**Por qué:** es la única lógica de negocio de verdad del proyecto. Todo lo demás es CRUD o proxy.

**DoD:** combinar al menos 2 filtros a la vez y obtener resultado coherente.

---

### 8. `GET /starwars/people` paginado — Día 3

- [ ] La guía pide "lista paginada". Ahora `getAllPeople()` devuelve todos de golpe.
- [ ] SWAPI ya no pagina → paginar en memoria sobre el array (reusar `PaginationQueryDto` + meta), o documentar la decisión de no hacerlo.

---

### 9. Colecciones — Día 7 (OPCIONAL / colchón)

- [ ] Entidades `Collection` + `CollectionItem` (`ManyToOne` a User, `OneToMany` items)
- [ ] `POST /collections`, `GET /collections`, `POST /collections/:id/items`, `DELETE /collections/:id/items/:itemId`

Solo si sobra tiempo tras cerrar el Día 6.

---

## 🐛 Bugs / detalles sueltos (no son de la guía)

- [ ] `favorites.client.add.request.ts`: `resourceType` valida con `@IsString()`. Debería ser `@IsEnum(ResourceTypeEnum)` (si no, acepta cualquier string).
- [ ] `swapi.client.controller.ts` línea ~74: `getAllFilms` tiene `@ApiOkResponse({ type: PeopleManyResponse })` → debería ser `FilmManyResponse` (copy-paste).
- [ ] `main.ts` DocumentBuilder: solo registra `addTag('auth')` y `addTag('users')`. Faltan `favorites` y `starwars`.
- [ ] Commitear `favorites.controller.ts` y `favorites.services.ts` (cambios de la paginación sin commit).
- [ ] `favorite.client.many.response.ts`: revisar que el tipo del constructor sea `FavoriteModel[]` y no `FavoriteVM[]`.

---

## Orden propuesto

1. Caché SWAPI (bloquea DoD Día 3)
2. `DELETE /favorites/:id` + arreglar `userId` del `POST` (bloquea DoD Día 4)
3. `@Throttle` login + `ExceptionFilter` (Día 5, rápidos)
4. Búsqueda + filtrado de personajes (Día 6, el grande)
5. Paginación de `people`, `resource_name`, colecciones — según tiempo
