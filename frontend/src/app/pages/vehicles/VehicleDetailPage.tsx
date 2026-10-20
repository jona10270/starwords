import { generatePath, useParams } from "react-router-dom";

import { ArchiveNote, LoadingBar } from "@/ui/atoms";
import { ErrorPanel } from "@/ui/molecules";
import { RecordDetail } from "@/ui/organisms/RecordDetail";
import type { Vehicle } from "@/core/modules/vehicle";

import { useGetVehicle } from "../../hooks/useGetVehicle";
import { isRetryable } from "../../hooks/retryResource";
import { ROUTES } from "../../navigation/routes";

import { formatRecordValue } from "@/app/format/formatRecordValue";

const CATEGORY_LABEL = "Vehicles";

// Paso el vehiculo al formato de ficha que entiende la ui
const toDetail = (vehicle: Vehicle) => {
    const highlights = [
        { label: "Modelo", value: formatRecordValue(vehicle.model) },
        { label: "Clase", value: formatRecordValue(vehicle.vehicleClass) },
        { label: "Fabricante", value: formatRecordValue(vehicle.manufacturer) },
        { label: "Coste", value: formatRecordValue(vehicle.costInCredits, "créditos") },
    ];

    return {
        badge: `#${vehicle.id.padStart(2, "0")} · ${CATEGORY_LABEL}`,
        breadcrumb: `SWAPI · Archivo central / ${CATEGORY_LABEL} / ${vehicle.name}`,
        title: vehicle.name,
        subtitle: highlights.slice(0, 2).map(({ label, value }) => `${label}: ${value}`).join(" · "),
        highlights,
        attributes: [
            { label: "Registro", value: vehicle.id },
            ...highlights,
            { label: "Longitud", value: formatRecordValue(vehicle.length, "m") },
            { label: "Velocidad atmosférica", value: formatRecordValue(vehicle.maxAtmospheringSpeed, "km/h") },
            { label: "Tripulación", value: formatRecordValue(vehicle.crew) },
            { label: "Pasajeros", value: formatRecordValue(vehicle.passengers) },
            { label: "Capacidad de carga", value: formatRecordValue(vehicle.cargoCapacity, "kg") },
            { label: "Autonomía", value: formatRecordValue(vehicle.consumables) },
            { label: "Pilotos", value: String(vehicle.pilots.length) },
            { label: "Películas", value: String(vehicle.films.length) },
        ],
        relations: [
            {
                title: "Pilotos",
                links: vehicle.pilots.map((pilot) => ({
                    id: pilot.id,
                    label: pilot.name,
                    to: generatePath(ROUTES.characterDetail, { id: pilot.id }),
                })),
            },
            {
                title: "Películas",
                links: vehicle.films.map((film) => ({
                    id: film.id,
                    label: film.title,
                    to: generatePath(ROUTES.filmDetail, { id: film.id }),
                })),
            },
        ],
    };
};

// Ficha de un vehiculo con todos sus datos
export const VehicleDetailPage = () => {
    const { id } = useParams();

    const vehicleQuery = useGetVehicle(id);
    const vehicle = vehicleQuery.data;

    return (
        <main className="relative z-10 mx-auto max-w-[1280px] px-4 pt-12 pb-24 sm:px-7">
            {vehicleQuery.isPending && <LoadingBar />}

            {vehicleQuery.isPending && (
                <ArchiveNote className="mt-12">Descodificando registro galáctico…</ArchiveNote>
            )}

            {vehicleQuery.isError && (
                <ErrorPanel
                    message={vehicleQuery.error.message}
                    onRetry={isRetryable(vehicleQuery.error) ? () => vehicleQuery.refetch() : undefined}
                    isRetrying={vehicleQuery.isFetching}
                />
            )}

            {vehicle && <RecordDetail backPath={ROUTES.vehicles} {...toDetail(vehicle)} />}
        </main>
    );
};
