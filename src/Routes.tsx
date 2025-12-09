export const ROUTES = {
    HOME: "/",
    ARMIES: "/armies",
}
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
    HOME: "Главная",
    ARMIES: "Армии",
};