import { CommonModule } from '@angular/common';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Recordatorio } from '../interfaces/interface';
import { Evento } from '../interfaces/interface';
import { RecordatorioService } from '../generalServices/recordatorio.service';
import { AddReminderService } from '../add-reminder/add-reminder.component.service';
import { EventosService } from '../generalServices/eventos.service';
import { LocalStorageService } from 'angular-web-storage';
import { RegisterService } from '../register/register.component.service';
import { LoginService } from '../login/login.component.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  private unsubscribe$ = new Subject<void>();
  @Output() addReminder = new EventEmitter<any>();


  constructor(private recordatorioService: RecordatorioService, 
    private eventoService: EventosService, 
    private localStorageService: LocalStorageService,
    private registerService: RegisterService,
    private loginService: LoginService,
    private addReminderService: AddReminderService
    ) { }

  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  diasMes: any[] = [];
  horas: string[] = [];
  anoActual: number = 0;
  mesActual: number = 0;
  mesActualNombre: string = '';
  nombresMeses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  vistaActual: string = 'mes';
  fechaActual: Date = new Date();
  username: string = '';

  eventos: (Recordatorio | Evento)[] = [];

  async ngOnInit(): Promise<void> {
    this.anoActual = this.fechaActual.getFullYear();
    this.mesActual = this.fechaActual.getMonth();
    this.mesActualNombre = this.nombresMeses[this.mesActual];
    this.calculateDaysForCalendar();
    this.inicializarHoras();
  
    this.username = this.localStorageService.get('username') || '';

    if (this.username !== '') {
      await this.actualizarEventos();
    }
  
    this.loginService.loginStatus$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.username = this.localStorageService.get('username');
        this.actualizarEventos();
      });
  
    this.registerService.registerStatus$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.username = this.localStorageService.get('username');
        this.actualizarEventos();
      });

    this.addReminderService.reminderAdded$.
      pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.actualizarEventos();
      });
  }

  addReminderFunction(object: any): void {
    this.addReminder.emit(object);
  }

  async actualizarEventos(): Promise<void> {
    const eventos = await this.eventoService.getEventos(this.username);
    const recordatorios = await this.recordatorioService.getRecordatorios(this.username);
    this.eventos = [...eventos, ...recordatorios];
  }

  seMuestraEvento(evento: (Recordatorio | Evento), tiempo: any, vista: string, diaIndex?: number): boolean {
    const eventoInicio = evento.fechaInicio;
    const eventoFin = evento.fechaFin;
    const eventoHora = eventoInicio.getHours();
    let horaString: string;

    switch (vista) {
      case 'dia':
        horaString = tiempo.split(':');
        return eventoInicio.getDate() === this.fechaActual.getDate() && parseInt(horaString, 10) === eventoHora;
      case 'semana':
        horaString = tiempo.split(':');
        const primerDiaSemana = (this.fechaActual.getDate() - this.fechaActual.getDay())+1;
        const ultimoDiaSemana = primerDiaSemana + 6;
        let eventoInicioDia = eventoInicio.getDay();
        let eventoFinDia = eventoFin.getDay();
        if (eventoInicioDia === 0) {
          eventoInicioDia = 6;
        }else{
          eventoInicioDia = eventoInicioDia - 1;
        }
        if (eventoFinDia === 0) {
          eventoFinDia = 6;
        }else{
          eventoFinDia = eventoFinDia - 1;
        }

        return eventoInicio.getDate() >= primerDiaSemana && eventoInicio.getDate() <= ultimoDiaSemana && eventoInicio.getHours() >= parseInt(horaString, 10) && eventoInicio.getHours() <= parseInt(horaString, 10)+1 && eventoInicioDia === diaIndex;

      case 'mes':
        return eventoInicio.getDate() === tiempo && eventoInicio.getMonth() === this.mesActual && eventoInicio.getFullYear() === this.anoActual;
      default:
        return false;
    }
  }
  
  

  cambiarVista(vista: string): void {
    this.vistaActual = vista;
    this.calculateDaysForCalendar();
  }

  cambiarMes(diferencia: number): void {
    this.mesActual += diferencia;
    
    if (this.mesActual < 0) {
      this.mesActual = 11;
      this.anoActual -= 1;
    } else if (this.mesActual > 11) {
      this.mesActual = 0;
      this.anoActual += 1;
    }

    this.mesActualNombre = this.nombresMeses[this.mesActual];
    this.calculateDaysForCalendar();
  }

  inicializarHoras(): void {
    for (let i = 0; i < 24; i += 2) {
      this.horas.push(`${i.toString().padStart(2, '0')}:00`);
    }
  }

  actualizarFechaActual(): void {
    this.fechaActual = new Date(this.anoActual, this.mesActual, new Date().getDate());
  }
  
  calculateDaysForCalendar(): void {
    if (this.vistaActual === 'mes') {
      const primerDiaMes = new Date(this.anoActual, this.mesActual, 1);
      const ultimoDiaMes = new Date(this.anoActual, this.mesActual + 1, 0);
    
      this.diasMes = [];
    
      const primerDiaSemana = (primerDiaMes.getDay() + 6) % 7;
      const ultimoDiaMesAnterior = new Date(this.anoActual, this.mesActual, 0).getDate();
      for (let i = ultimoDiaMesAnterior - primerDiaSemana + 1; i <= ultimoDiaMesAnterior; i++) {
        this.diasMes.push({type: 'otro', value: i});
      }
    
      for (let i = 1; i <= ultimoDiaMes.getDate(); i++) {
        this.diasMes.push({type: 'normal', value: i});
      }
    
      const ultimoDiaSemana = (ultimoDiaMes.getDay() + 6) % 7;
      for (let i = 1; i < 7 - ultimoDiaSemana; i++) {
        this.diasMes.push({type: 'otro', value: i});
      }
    } else if (this.vistaActual === 'semana') {
      const fechaActual = new Date();
      const primerDiaSemana = fechaActual.getDate() - fechaActual.getDay();
      const ultimoDiaSemana = primerDiaSemana + 6;
      this.diasMes = [];
      for (let i = primerDiaSemana; i <= ultimoDiaSemana; i++) {
        this.diasMes.push(i);
      }
    } else {
      this.diasMes = [this.fechaActual.getDate()];
    }
  }
  

  eliminarEvento(evento: any): void {
    if(evento.tipo === 'evento'){
      this.eventoService.deleteEvento(this.username, evento.id);
    }else if(evento.tipo === 'recordatorio'){
      this.recordatorioService.deleteRecordatorio(this.username, evento.id);
    }
    this.eventos = this.eventos.filter(e => e.id !== evento.id);
  }
}
