import { Observable } from 'rxjs/internal/Observable';
import { DataGridPagination } from './../../config/departure-table/data-grid-pagination.config';
import { ColumnDefinition } from './../../config/departure-table/column-def.config';


export class DataGridConfigModel {
  public columnDefs: Array<ColumnDefinition>;
  public filter?: boolean;
  public paginator?: DataGridPagination;
  public service?: Observable<any[]>;
}
