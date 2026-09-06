# starwords
App para ver informacion de star words

## Migraciones

Generar una nueva migracion:

```bash
pnpm typeorm:generate src/infra/postgres/migrations/<nombre-de-la-migracion>
```

Ejecutar las migraciones pendientes:

```bash
pnpm typeorm:run
```

Revertir la ultima migracion:

```bash
pnpm typeorm:revert
```
