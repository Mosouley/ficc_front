import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
   ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit{

  @Output()selectedPeriod = new EventEmitter<any>();

  periodIndex = 1;

  dateForm!: FormGroup;
  setRange = false;
  isEnable = false;

  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
    this.dateForm = this.fb.group({
      start_date: [new Date(), Validators.required],
      end_date: [new Date(), Validators.required],

    })

  }
  reportPeriod = [
    {
      id: 1,
      name: 'Today ',
      timePeriod: { startDay: new Date(), endDay: new Date() },
    },
    {
      id: 2,
      name: 'Current Period',
      timePeriod: { startDay: new Date(), endDay: new Date() },
    },
    {
      id: 3,
      name: 'This Month',
      timePeriod: { startDay: new Date(), endDay: new Date() },
    },
    {
      id: 4,
      name: ' This Quater ',
      timePeriod: { startDay: new Date(), endDay: new Date() },
    },
    {
      id: 5,
      name: 'This Year',
      timePeriod: { startDay: new Date(), endDay: new Date() },
    },
    {
      id: 6,
      name: 'Select a Range',
      timePeriod: { startDay: new Date(), endDay: new Date() },
    },
  ];

  setPeriodIntervals(choix: number) {

    const today = new Date();
    switch (Number(choix)) {
      case 1:
        this.reportPeriod[0].timePeriod.startDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        this.reportPeriod[0].timePeriod.endDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );

        break;
      case 2:
        this.reportPeriod[1].timePeriod.startDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 7
        );
        this.reportPeriod[1].timePeriod.endDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        break;

      case 3:
        this.reportPeriod[2].timePeriod.startDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );
        this.reportPeriod[2].timePeriod.endDay = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        );
        break;
      case 4:
        this.reportPeriod[3].timePeriod.startDay = new Date(
          today.getFullYear(),
          today.getMonth() - 2,
          1
        );
        this.reportPeriod[3].timePeriod.endDay = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        );
        break;
      case 5:
        this.reportPeriod[4].timePeriod.startDay = new Date(
          today.getFullYear(),
          0,
          1
        );
        this.reportPeriod[4].timePeriod.endDay = new Date(
          today.getFullYear(),
          11,
          31
        );

        break;
      case 6:
        this.setRange = true;
        this.reportPeriod[5].timePeriod.startDay =
          this.dateForm.controls['start_date'].value;
        this.reportPeriod[5].timePeriod.endDay =
          this.dateForm.controls['end_date'].value;
        break;

      default:
        this.reportPeriod[0].timePeriod.startDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDay()
        );
        this.reportPeriod[0].timePeriod.endDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDay()
        );

        break;
    }
  }

  getPeriod(event: any) {
    this.setRange = false;
    this.periodIndex = event.target.value;
    this.setPeriodIntervals(this.periodIndex)

    if (this.periodIndex == 6) {
      this.setRange = true;
    }

    this.selectedPeriod.emit(this.reportPeriod[this.periodIndex-1])

  }

  enableReport() {
    this.isEnable = false;

    if (this.periodIndex > 0 && this.periodIndex !== 6) {
      this.isEnable = true;

    } else {
      if (this.dateForm.valid) {
        this.isEnable = true;
      } else {
        this.isEnable = false;

      }
    }
  }

}
