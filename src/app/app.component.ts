import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit() {

    const date = new Date(); // Fri Feb 18 2022 08:33:40 GMT+0100 (Mitteleuropäische Normalzeit)
    const dateToBackend = date.toISOString(); // 2022-02-18T07:33:40.030Z 
    const dateFromBackend = new Date(dateToBackend); // Fri Feb 18 2022 08:33:40 GMT+0100 (Mitteleuropäische Normalzeit)
    // but string returned from backend is: '2022-02-18 07:33:40.030'

    
    // Postgres Format TIMESTAMP ignores timezone offset,
    // but writes it into table field, which is hepful for humans 
    // to interpret the stored value
    // TIMESTAMP '2004-10-19 10:23:54+02'
    
    // To ensure that a literal is treated as timestamp with time zone, give it the correct explicit type:
    // TIMESTAMP WITH TIME ZONE '2004-10-19 10:23:54+02'


    // The getTimezoneOffset() method returns the difference, 
    // in minutes, between a date as evaluated in the UTC time zone, 
    // and the same date as evaluated in the local time zone.
    // UTC(GMT): 2022-02-18T06:51:31.436Z 
    // GMT+1: 2022-02-18T07:51:31.436Z
    const timeZoneOffset = date.getTimezoneOffset(); // UTC - GMT+1  = -60
    const extension = (timeZoneOffset / -60).toString().padStart(3, '+0'); // +01

    // Angular: '2004-10-19T10:23:54Z'
    const postgresTimestamp = dateToBackend.replace('Z', extension);
    // Angular to Postres: '2004-10-19T10:23:54+02'
    
    // Postgres: '2004-10-19 10:23:54+02'
    const postgresToAngular = new Date(postgresTimestamp.slice(0, -3).concat('Z')); // '2004-10-19 10:23:54+02' >> '2004-10-19 10:23:54Z'
    // Postgres to Angular: '2004-10-19 10:23:54Z' (UTC, present it to users local timezone by using JS .toLocalDate() and other methods)


    console.log(date);
    console.log(dateToBackend);
    console.log(dateFromBackend);
    console.log(timeZoneOffset);
    console.log(extension);
    console.log(postgresTimestamp);
    console.log(postgresToAngular);
  }


}

