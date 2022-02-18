import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MatDatepickerModule,
    MatTableModule,
    MatNativeDateModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
