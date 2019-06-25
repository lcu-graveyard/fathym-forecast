export class DepartureTableModel {
    public origin: string;
    public destination: string;
    public departureTime: string;
    public includeAltRoutes: boolean = true;

    constructor(origin: string, destination: string, departureTime: string, includeAltRoutes: boolean) {
        this.origin = origin;
        this.destination = destination;
        this.departureTime = departureTime;
        this.includeAltRoutes = includeAltRoutes;
    }
}