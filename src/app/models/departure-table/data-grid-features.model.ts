import { PaginationConfig } from './../../config/departure-table/pagination.config';

export class DataGridFeaturesModel {
    public paginator: PaginationConfig;
    public rowSelectable: boolean = false;
    public filter: boolean = false;
    public showLoader: boolean = false;
    public showSelection: boolean = false;
  }
