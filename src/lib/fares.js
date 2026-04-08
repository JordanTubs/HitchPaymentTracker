export const DESTINATIONS = [
  "Addu Jacinto",
  "Uraya",
  "Mintal",
  "Puan",
];

const ROUTE_FARES = {
  "Addu Jacinto:Uraya": 50,
  "Uraya:Addu Jacinto": 50,
  "Addu Jacinto:Mintal": 40,
  "Mintal:Addu Jacinto": 40,
  "Addu Jacinto:Puan": 40,
  "Puan:Addu Jacinto": 40,
};

export function calculateFare(pickupPoint, dropoffPoint, rideType) {
  const baseFare = ROUTE_FARES[`${pickupPoint}:${dropoffPoint}`] ?? 40;
  return rideType === "Round trip" ? baseFare * 2 : baseFare;
}
