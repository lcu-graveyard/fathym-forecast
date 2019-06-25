import { NgModule } from '@angular/core';
import { DataGridPipes } from './../../utils/pipes/data-grid.pipes';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    DataGridPipes
  ],
  imports: [
    FlexLayoutModule
  ],
  exports: [
    DataGridPipes,
    FlexLayoutModule
  ]
})
export class SharedModule { }
