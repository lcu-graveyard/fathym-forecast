import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
          MatButtonModule,
          MatIconModule,
          MatFormFieldModule,
          MatInputModule,
          MatCardModule,
          MatDatepickerModule,
          MatNativeDateModule,
          MatCheckboxModule,
          MatSidenavModule,
          MatToolbarModule,
          MatListModule,
          MatTabsModule,
          MatSelectModule,
          MatProgressSpinnerModule,
          MatDialogModule,
          MatTableModule,
          MatSortModule,
          MatPaginatorModule
         } from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatTabsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ],
  exports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatTabsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ]
})
export class MaterialModule { }
