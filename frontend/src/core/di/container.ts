import { config } from "@/core/config";
import {
    createAuthStore,
    BrowserSessionStorage,
    LogoutUseCase,
    AuthHTTPRepository,
    LoginUseCase,
    RegisterUseCase,
    RestoreSessionUseCase,
} from "@/core/modules/auth";

import { 
    CharacterHTTPRepository,
    GetCharacterUseCase,
    GetOneCharacterUseCase,
 } from "../modules/character";

import { HttpClient } from "@/core/modules/common";
import { FilmHTTPRepository, GetAllFilmsUseCase } from "../modules/film";
import { GetFilmUseCase } from "../modules/film/app/GetFilmUseCase";
import { GetAllStarshipsUseCase, GetStarshipUseCase, StarshipHTTPRepository } from "../modules/starship";
import { GetAllVehiclesUseCase, GetVehicleUseCase, VehicleHTTPRepository } from "../modules/vehicle";
import { GetAllSpeciesUseCase, GetSpecieUseCase, SpecieHTTPRepository } from "../modules/specie";
import { GetAllPlanetsUseCase, GetPlanetUseCase, PlanetHTTPRepository } from "../modules/planet";

export const authStore = createAuthStore();

// Decido donde se guardara la session del navegador
const authSessionStorage = new BrowserSessionStorage({ storage: sessionStorage });

// Primero hago el logout por que lo necesita cuando el backend responde 401
export const logoutUseCase = new LogoutUseCase({ authSessionStorage, authStore });

// Creo la peticion htpp que pone el token en cada peticion y cierra session si caduca
const httpClient = new HttpClient({
    baseUrl: config.apiUrl,
    getToken: () => authSessionStorage.get()?.accessToken ?? null,
    onUnauthorized: () => void logoutUseCase.execute(),
})

// Conecto el puerto authrepository con el adaptador que habla con el backend
const authRepository = new AuthHTTPRepository({ httpClient });
const characterRepository = new CharacterHTTPRepository({ httpClient });
const filmRepository = new FilmHTTPRepository({ httpClient });
const starshipRepository = new StarshipHTTPRepository({ httpClient });
const vehicleRepository = new VehicleHTTPRepository({ httpClient });
const specieRepository = new SpecieHTTPRepository({ httpClient });
const planetRepository = new PlanetHTTPRepository({ httpClient });

// =====================================================
// AUTH
// =====================================================
export const loginUseCase = new LoginUseCase({
    authRepository,
    authSessionStorage,
    authStore,
})

export const registerUseCase = new RegisterUseCase({
    authRepository,
})

export const restoreSessionUseCase = new RestoreSessionUseCase({
    authSessionStorage,
    authStore,
    authRepository,
})

// =====================================================
// GET CHRACTERS
// =====================================================
export const getCharacterUseCase = new GetCharacterUseCase({
    characterRepository
})

export const getOneCharacterUseCase = new GetOneCharacterUseCase({
    characterRepository
})

// =====================================================
// GET FILMS
// =====================================================
export const getAllFilmsUseCase = new GetAllFilmsUseCase({
    filmRepository
})

export const getFilmUseCase = new GetFilmUseCase({
    filmRepository
})

// =====================================================
// GET STARSHIPS
// =====================================================
export const getAllStarshipUseCase = new GetAllStarshipsUseCase({
    starshipRepository
})

export const getStarshipUseCase = new GetStarshipUseCase({
    starshipRepository
})

// =====================================================
// GET VEHICLES
// =====================================================
export const getAllVehiclesUseCase = new GetAllVehiclesUseCase({
    vehicleRepository
})

export const getVehicleUseCase = new GetVehicleUseCase({
    vehicleRepository
})


// =====================================================
// GET SPECIES
// =====================================================
export const getAllSpeciesUseCase = new GetAllSpeciesUseCase({
    specieRepository
})

export const getSpecieUseCase = new GetSpecieUseCase({
    specieRepository
})

// =====================================================
// GET PLANETS
// =====================================================
export const getAllPlanetsUseCase = new GetAllPlanetsUseCase({
    planetRepository
})

export const getPlanetUseCase = new GetPlanetUseCase({
    planetRepository
})