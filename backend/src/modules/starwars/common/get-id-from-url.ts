import { BadGatewayException } from '@nestjs/common';

export const getIdFromUrl = (url: string): string => {
  const id = new URL(url).pathname.split('/').filter(Boolean).pop();
  if (!id) {
    throw new BadGatewayException(`SWAPI returned an invalid url: ${url}`);
  }
  return id;
};
