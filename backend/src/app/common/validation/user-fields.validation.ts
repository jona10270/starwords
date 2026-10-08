import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsByteLength,
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

// Reglas de los campos de usuario en un solo sitio para registro, login y edicion

// Minimo de desarrollo: en produccion sube a 12 con complejidad
export const PASSWORD_MIN_LENGTH = 4;
// Bcrypt solo usa los primeros 72 bytes asi que no dejo pasar mas
export const PASSWORD_MAX_BYTES = 72;
export const EMAIL_MAX_LENGTH = 254;
// Las mismas reglas que valida el formulario del frontend
export const USERNAME_PATTERN = /^[a-z0-9_]{4,15}$/;

// Quito espacios y paso a minusculas para que Ana@x.com y ana@x.com sean la misma cuenta
export const NormalizeEmail = (): PropertyDecorator =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  );

// Quito los espacios de los lados antes de validar
export const Trim = (): PropertyDecorator =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  );

export const IsUserEmail = (): PropertyDecorator =>
  applyDecorators(NormalizeEmail(), IsEmail(), MaxLength(EMAIL_MAX_LENGTH));

export const IsUsername = (): PropertyDecorator =>
  applyDecorators(
    Trim(),
    IsString(),
    Matches(USERNAME_PATTERN, {
      message:
        'username must be 4 to 15 characters: lowercase letters, numbers or _',
    }),
  );

// Politica de contraseña para crearla o cambiarla
export const IsNewPassword = (): PropertyDecorator =>
  applyDecorators(
    IsString(),
    MinLength(PASSWORD_MIN_LENGTH),
    IsByteLength(0, PASSWORD_MAX_BYTES),
  );

// En el login solo limito el tamaño porque la politica puede cambiar con cuentas ya creadas
export const IsLoginPassword = (): PropertyDecorator =>
  applyDecorators(IsString(), IsByteLength(1, PASSWORD_MAX_BYTES));
