import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFavorites1788624051132 implements MigrationInterface {
  public name = 'AddFavorites1788624051132';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "favorites" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid NOT NULL,
                "resourceId" varchar NOT NULL,
                "resourceType" varchar NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),

                CONSTRAINT "PK_favorites_id"
                    PRIMARY KEY ("id"),

                CONSTRAINT "UQ_favorites_userId_resourceId_resourceType"
                    UNIQUE ("userId", "resourceId", "resourceType"),

                CONSTRAINT "FK_favorites_userId"
                    FOREIGN KEY ("userId")
                    REFERENCES "users"("id")
                    ON DELETE CASCADE
            )
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_favorites_userId"
            ON "favorites" ("userId")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX IF EXISTS "IDX_favorites_userId"
        `);

    await queryRunner.query(`
            DROP TABLE "favorites"
        `);
  }
}
