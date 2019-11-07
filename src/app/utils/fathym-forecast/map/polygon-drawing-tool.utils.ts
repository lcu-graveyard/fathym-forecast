import { AtlasMapComponent } from '@acaisoft/angular-azure-maps';

// keep this external so we can reach it from within event handlers
let activeShape: atlas.Shape;

export class PolygonDrawingTool {

    /**
     * The layer the polygon will be above, not required
     */
    protected beforeLayer: atlas.layer.Layer;

    /**
     * Polygon datasource
     */
    protected datasource: atlas.source.DataSource;

    /**
     * Bubble layer to hold the polygon shape
     */
    protected dragHandleLayer: any;

    /**
     * Callback function from parent class
     */
    protected drawingEndedCallback: Function;

    /**
     * Radius of polygon point
     */
    protected handleRadius: number = 5;

    /**
     * Map component
     */
    protected map: atlas.Map;

    /**
     * A tool for drawing polygons on the map using a mouse.
     *
     * @param map An Azure Maps map instance to attach the drawing tool too.
     *
     * @param beforeLayer The layer or name of a layer to render the drawing layer before.
     *
     * @param drawingEndedCallback Function that is called when a drawing has been completed.
     *
     */
    constructor(mapComp: AtlasMapComponent, beforeLayer: atlas.layer.Layer, drawingEndedCallback: Function) {

      if (!mapComp || !mapComp.map) { return; }

        this.Clear();

        this.map = mapComp.map;
        this.datasource = new atlas.source.DataSource();
        this.beforeLayer = beforeLayer;
        this.drawingEndedCallback = drawingEndedCallback;

        this.setupPolygon();
    }

    /**
     * Start setting up the polygon layer
     */
    protected setupPolygon(): void {

      if (!this.map || !this.datasource) { return; }

        this.map.sources.add(this.datasource);

        const pl = new atlas.layer.PolygonLayer(this.datasource, null, {
            fillColor: 'rgba(255, 165, 0, 0.2)'
        });

        // this.map.layers.add(pl, this.beforeLayer);
        this.map.layers.add(pl);

        this.map.layers.add(new atlas.layer.LineLayer(this.datasource, null, {
            strokeColor: 'orange',
            strokeWidth: 2
        }), this.beforeLayer);

        this.dragHandleLayer = new atlas.layer.BubbleLayer(this.datasource, null, {
            color: 'orange',
            radius: this.handleRadius,
            strokeColor: 'white',
            strokeWidth: 2
        });

        this.map.layers.add(this.dragHandleLayer);
    }

    /**
     * Mouse up event handler
     *
     * @param mapEvent object containing map, originalEvent, pixel, position, preventDefault, shapes, & types
     */
    protected mouseUp(mapEvent: any): void {
        if (activeShape) {
          const ring: Array<any> = activeShape.getCoordinates()[0];
            ring.pop(); // Remove preview coordinate
            ring.push(mapEvent.position); // add current coordinate
            ring.push(mapEvent.position); // add a preview coordinate
            activeShape.setCoordinates([ring]);
        }
    }

    /**
     * Mouse up event handler
     *
     * @param mapEvent object containing map, originalEvent, pixel, position, preventDefault, shapes, & types
     */
    protected mouseMove(mapEvent: any): void {
        if (activeShape) {
            // update the last coordinate in the polygon which is there for preview purposes
            const ring: Array<any> = activeShape.getCoordinates()[0];

            if (ring.length > 1) {
                ring[ring.length -1] = mapEvent.position;
                activeShape.setCoordinates([ring]);
            }
        }
    }

    /**
     * Mouse up event handler
     *
     * @param mapEvent object containing map, originalEvent, pixel, position, preventDefault, shapes, & types
     */
    protected dragHandleSelected(mapEvent: any): void {
        if (activeShape) {
            const ring: Array<any> = activeShape.getCoordinates()[0];

            if (ring.length > 0) {
                // check to see if user clicked on or close to the first position
                const dist: number = this.pixelDistance(ring[0], mapEvent.position);

                if (dist <= this.handleRadius * 1.2) {
                    ring.pop(); // remove the preview coordinate
                    ring.pop(); // Remove the last coordinate that was added due to the maps mouseup event

                    // close the ring
                    if (ring.length >= 1) {
                        ring.push([ring[0][0], ring[0][1]]); // Add the first coordinate to the end to close the polygon.
                    }

                    activeShape.setCoordinates([ring]);
                    this.endDrawing();
                }
            }
        }
    }

    /**
     * Starts a new drawing session. Clears all data in the drawing layer
     */
    public StartDrawing(): void {
        this.Clear();

        if (!this.map || !this.datasource) { return; }

        this.map.getCanvasContainer().style.cursor = 'pointer';

        activeShape = new atlas.Shape(new atlas.data.Polygon([[]]));
        this.datasource.add(activeShape);

        // Show drag handle layer.
        this.dragHandleLayer.setOptions({
            visible: true
        });

        // Add mouse events to map.
        this.map.events.add('mousemove', this.mouseMove);
        this.map.events.add('mouseup', this.mouseUp);
        this.map.events.add('mouseup', this.dragHandleLayer, this.dragHandleSelected.bind(this));
    }

     /**
     * Stops any current drawing in progresse
     */
    protected endDrawing(): void {
      if (this.map) {
        // Unbind mouse events
        this.map.events.remove('mousemove', this.mouseMove);
        this.map.events.remove('mouseup',  this.mouseUp);

        this.map.getCanvasContainer().style.cursor = '';
      }

      if (this.dragHandleLayer) {
        // hide drag handler layer
        this.dragHandleLayer.setOptions({
          visible: false
        });

        // unbind mouse event
        this.map.events.remove('mouseup', this.dragHandleLayer, this.dragHandleSelected.bind(this));
      }

      if (this.drawingEndedCallback && activeShape) {
        const shapeCoordinates: Array<Array<number>> = activeShape.getCoordinates()[0];

          this.drawingEndedCallback(shapeCoordinates);
      }
    }

    /**
     * Clears all data in the drawing layer
     */
    public Clear(): void {

        if (this.datasource) { 
            this.datasource.clear(); 
        }

        activeShape = null;
        
        this.endDrawing();
    }

    /**
     * Check if the last point is close to the first point
     *
     * @param firstPos first polygon position
     *
     * @param last last polygon position
     */
    protected pixelDistance(firstPos: number, lastPos: number): number {
        // Approximately
        const dLat = (lastPos[1] - firstPos[1]) * (Math.PI / 180);
        const dLon = (lastPos[0] - firstPos[0]) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((firstPos[1]) * (Math.PI / 180)) * Math.cos((lastPos[1]) * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const groundResolution = Math.cos(lastPos[1] * Math.PI / 180) * Math.PI / (Math.pow(2, this.map.getCamera().zoom) * 256);

        return c / groundResolution;
    }
}
