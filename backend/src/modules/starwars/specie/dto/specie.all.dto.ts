import {
  ResourceNameDto,
  ResourceTitleDto,
} from '../../common/resource-ref.dto';

export interface SpeciesAllDto {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  skin_colors: string;
  hair_colors: string;
  eye_colors: string;
  average_lifespan: string;
  homeworld: string | null;
  language: string;
  people: string[];
  films: string[];
  url: string;
}

export type SpecieWithIdDto = SpeciesAllDto & { id: string };

export type SpecieDetailDto = Omit<
  SpecieWithIdDto,
  'homeworld' | 'people' | 'films'
> & {
  homeworld: ResourceNameDto | null;
  people: ResourceNameDto[];
  films: ResourceTitleDto[];
};
