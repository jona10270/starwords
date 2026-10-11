import { useParams } from "react-router-dom";

import { ArchiveNote, LoadingBar } from "@/ui/atoms";
import { ErrorPanel } from "@/ui/molecules";
import { RecordDetail } from "@/ui/organisms/RecordDetail";
import type { Vehicle } from "@/core/modules/vehicle";

import { useGetVehicle } from "../../hooks/useGetVehicle";
import { isRetryable } from "../../hooks/retryResource";
import { ROUTES } from "../../navigation/routes";

import { formatStarshipValue } from "../starships/formatStarshipValue";

const CATEGORY_LABEL = "Vehicles";

// Paso el vehiculo al formato de ficha que entiende la ui
const toDetail = (vehicle: Vehicle) => {
    const highlights = [
        { label: "Modelo", value: formatStarshipValue(vehicle.model) },
        { label: "Clase", value: formatStarshipValue(vehicle.vehicleClass) },
        { label: "Fabricante", value: formatStarshipValue(vehicle.manufacturer) },
        { label: "Coste", value: formatStarshipValue(vehicle.costInCredits, "créditos") },
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
            { label: "Longitud", value: formatStarshipValue(vehicle.length, "m") },
            { label: "Velocidad atmosférica", value: formatStarshipValue(vehicle.maxAtmospheringSpeed, "km/h") },
            { label: "Tripulación", value: formatStarshipValue(vehicle.crew) },
            { label: "Pasajeros", value: formatStarshipValue(vehicle.passengers) },
            { label: "Capacidad de carga", value: formatStarshipValue(vehicle.cargoCapacity, "kg") },
            { label: "Autonomía", value: formatStarshipValue(vehicle.consumables) },
            { label: "Pilotos", value: String(vehicle.pilots.length) },
            { label: "Películas", value: String(vehicle.films.length) },
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
