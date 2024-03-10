import { CommonModule } from '@angular/common';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Recordatorio } from '../interfaces/interface';
import { Evento } from '../interfaces/interface';
import { RecordatorioService } from '../generalServices/recordatorio.service';
import { AddReminderService } from '../add-reminder/add-reminder.component.service';
import { EventosService } from '../generalServices/eventos.service';
import { SessionStorageService } from 'angular-web-storage';
import { RegisterService } from '../register/register.component.service';
import { LoginService } from '../login/login.component.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { D, co } from '@fullcalendar/core/internal-common';
import e from 'express';

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
    private sessionStorageService: SessionStorageService,
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

    this.username = this.sessionStorageService.get('username') || '';

    if (this.username !== '') {
      await this.actualizarEventos();
    }

    this.loginService.loginStatus$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.username = this.sessionStorageService.get('username');
        this.actualizarEventos();
      });

    this.registerService.registerStatus$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.username = this.sessionStorageService.get('username');
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
    const eventoInicio: Date = evento.fechaInicio;
    const eventoFin: Date = evento.fechaFin;
    const hoy = new Date();
    const eventoHora = eventoInicio.getHours();
    let horaString;

    const esMismoDia = (fecha1: Date, fecha2: Date): boolean => {
      return fecha1.getDate() === fecha2.getDate() &&
         fecha1.getMonth() === fecha2.getMonth() &&
         fecha1.getFullYear() === fecha2.getFullYear();
    };

    

    switch (vista) {
      case 'dia':
        horaString = tiempo.split(':');
        const diaSemanaEvento = eventoInicio.getDay();
        const diaSemanaHoy = hoy.getDay();
        if ((evento.repetir === 'Diario') ||
            (evento.repetir === 'Ninguno' && esMismoDia(eventoInicio, hoy)) ||
            (evento.repetir === 'Semanal' && diaSemanaEvento === diaSemanaHoy) ||
            (evento.repetir === 'Mensual' && eventoInicio.getDate() === hoy.getDate()) ||
            (evento.repetir === 'Anual' && eventoInicio.getMonth() === hoy.getMonth() && eventoInicio.getDate() === hoy.getDate())) {
          return parseInt(horaString, 10) === eventoHora;
        }else{
          return false;
        }
        case 'semana':
          horaString = tiempo.split(':');

          let fechaActualDia = this.fechaActual.getDay();
          fechaActualDia = fechaActualDia === 0 ? 6 : fechaActualDia - 1;

          const primerDiaSemana = (this.fechaActual.getDate() - fechaActualDia);
          const ultimoDiaSemana = primerDiaSemana + 6;

          let eventoInicioDia = eventoInicio.getDay();
          let eventoFinDia = eventoFin ? eventoFin.getDay() : eventoInicio.getDay();
        
          // Ajuste para comenzar la semana en domingo
          eventoInicioDia = eventoInicioDia === 0 ? 6 : eventoInicioDia - 1;
          eventoFinDia = eventoFinDia === 0 ? 6 : eventoFinDia - 1;
        
          const esEventoEnSemanaActual = (fecha: Date) => {
            const diaDelMes = fecha.getDate();
            console.log("dia del mes: " + diaDelMes, "primer dia de la semana: " + primerDiaSemana, "ultimo dia de la semana: " + ultimoDiaSemana);
            return diaDelMes >= primerDiaSemana && diaDelMes <= ultimoDiaSemana;
          };
        
          switch (evento.repetir) {
            case 'Diario':
              return parseInt(horaString, 10) === eventoInicio.getHours();
        
            case 'Semanal':
              return eventoInicioDia === diaIndex && parseInt(horaString, 10) === eventoInicio.getHours();
        
            case 'Mensual':
              return eventoInicio.getDate() === this.fechaActual.getDate() && esEventoEnSemanaActual(eventoInicio) && parseInt(horaString, 10) === eventoInicio.getHours();
        
            case 'Anual':
              return eventoInicio.getMonth() === this.fechaActual.getMonth() && eventoInicio.getDate() === this.fechaActual.getDate() && parseInt(horaString, 10) === eventoInicio.getHours();
        
            case 'Ninguno':
              return eventoInicio.getDate() >= primerDiaSemana && eventoInicio.getDate() <= ultimoDiaSemana && eventoInicio.getHours() >= parseInt(horaString, 10) && eventoInicio.getHours() <= parseInt(horaString, 10) + 1 && eventoInicioDia === diaIndex;

            default:
              return false;
          }
          case 'mes':
            console.log(evento);
            const diaDelMesEvento = eventoInicio.getDate();
            const mesEvento = eventoInicio.getMonth();
            const añoEvento = eventoInicio.getFullYear();
          
            switch (evento.repetir) {
              case 'Diario':
                return true;
                
              case 'Semanal':
                let diaCasilla: Number = 0;
                if(tiempo.type === 'otro'){
                  if(tiempo.value > 7){
                    const mesAnterior = this.mesActual <= 0 ? 11 : this.mesActual - 1;
                    if(mesAnterior === 11){
                      diaCasilla = new Date(this.anoActual-1, mesAnterior, tiempo.value).getDay();
                    }else{
                      diaCasilla = new Date(this.anoActual, mesAnterior, tiempo.value).getDay();
                    }
                  }else if(tiempo.value < 7){
                    const mesSiguiente = this.mesActual >= 11 ? 0 : this.mesActual + 1;
                    if(mesSiguiente === 0){
                      diaCasilla = new Date(this.anoActual+1, mesSiguiente, tiempo.value).getDay();
                    }else{
                      diaCasilla = new Date(this.anoActual, mesSiguiente, tiempo.value).getDay();
                    }
                  }
                }else{
                  diaCasilla = new Date(this.anoActual, this.mesActual, tiempo.value).getDay();
                }
                
                return diaCasilla === eventoInicio.getDay();
                
              case 'Mensual':
                return diaDelMesEvento === tiempo.value;
          
              case 'Anual':
                return diaDelMesEvento === tiempo.value && mesEvento === this.mesActual && tiempo.type === 'normal';
          
              case 'Ninguno':
                return diaDelMesEvento === tiempo.value && mesEvento === this.mesActual && añoEvento === this.anoActual && tiempo.type === 'normal';
          
              default:
                return false;
            }
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
