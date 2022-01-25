import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DirectiveTestComponent } from './directive-test/directive-test.component';

@NgModule({
  declarations: [
    AppComponent,
    DirectiveTestComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
