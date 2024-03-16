import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mini-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-calendar.component.html',
  styleUrls: ['./mini-calendar.component.css']
})

export class MiniCalendarComponent implements OnInit {
  monthNames: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  currentDate: Date = new Date();
  currentDay: number = this.currentDate.getDate();
  monthNumber: number = this.currentDate.getMonth();
  currentYear: number = this.currentDate.getFullYear();
  dates: number[] = [];
  lastDays: number[] = [];
  nextDays: number[] = []; // For next month's days if needed
  month: string = this.monthNames[this.monthNumber];
  year: number = this.currentYear;
  selectedDay: number | null = null;

  selectDay(day: number): void {
    this.selectedDay = day;
    // Optional: Emit an event if you need to notify a parent component
    // this.daySelected.emit(day);
  }

  ngOnInit(): void {
    this.writeMonth(this.monthNumber);
  }

  writeMonth(month: number): void {
    const firstDayOfTheMonth = new Date(this.currentYear, month, 1).getDay();
    const totalDaysInMonth = this.getTotalDays(month);

    // Adjusting first day to match Monday as the start of the week
    const daysBefore = (firstDayOfTheMonth + 6) % 7;

    const lastMonth = month === 0 ? 11 : month - 1;
    const totalDaysLastMonth = this.getTotalDays(lastMonth);

    // Fix for lastDays to correctly display the ending days of the previous month
    this.lastDays = [];
    for (let i = totalDaysLastMonth - daysBefore + 1; i <= totalDaysLastMonth; i++) {
        this.lastDays.push(i);
    }

    this.dates = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

    // Calculate the number of days to display from the next month to fill the week
    const totalDisplayDays = 42; // 6 weeks * 7 days to fill the calendar completely
    const nextDaysCount = totalDisplayDays - (this.dates.length + this.lastDays.length);
    this.nextDays = Array.from({ length: nextDaysCount }, (_, i) => i + 1);
  }


  getTotalDays(month: number): number {
    if (month === -1) month = 11;
    if ([0, 2, 4, 6, 7, 9, 11].includes(month)) return 31;
    if ([3, 5, 8, 10].includes(month)) return 30;
    return this.isLeapYear() ? 29 : 28;
  }

  isLeapYear(): boolean {
    return (this.currentYear % 4 === 0 && this.currentYear % 100 !== 0) || (this.currentYear % 400 === 0);
  }

  lastMonth(): void {
    if (this.monthNumber > 0) {
      this.monthNumber--;
    } else {
      this.monthNumber = 11;
      this.currentYear--;
    }
    this.updateCalendar();
  }

  nextMonth(): void {
    if (this.monthNumber < 11) {
      this.monthNumber++;
    } else {
      this.monthNumber = 0;
      this.currentYear++;
    }
    this.updateCalendar();
  }

  updateCalendar(): void {
    this.month = this.monthNames[this.monthNumber];
    this.year = this.currentYear;
    this.writeMonth(this.monthNumber);
  }
}
