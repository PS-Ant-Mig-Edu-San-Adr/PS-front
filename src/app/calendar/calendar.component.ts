import {CommonModule} from '@angular/common';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Evento, Group, Recordatorio} from '../interfaces/interface';
import {RecordatorioService} from '../generalServices/recordatorio.service';
import {AddReminderService} from '../add-reminder/add-reminder.component.service';
import {EventosService} from '../generalServices/eventos.service';
import {SessionStorageService} from 'angular-web-storage';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AuthService} from "../generalServices/auth-service/auth.service";

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
  @Output() editReminder = new EventEmitter<any>();
  @Output() showDetails = new EventEmitter<any>();



  constructor(private recordatorioService: RecordatorioService,
    private eventoService: EventosService,
    private sessionStorageService: SessionStorageService,
    private authService: AuthService,
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
  userId: string = '';
  userGroups: Group[] = [];

  eventos: (Recordatorio | Evento)[] = [];

  async ngOnInit(): Promise<void> {
    this.anoActual = this.fechaActual.getFullYear();
    this.mesActual = this.fechaActual.getMonth();
    this.mesActualNombre = this.nombresMeses[this.mesActual];
    this.calculateDaysForCalendar();
    this.inicializarHoras();

    this.userId = this.sessionStorageService.get('id') || '';

    if (this.userId !== '') {
      await this.actualizarEventos();
    }

    this.authService.loginStatus$()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.userId = this.sessionStorageService.get('id');
        if (this.userId) {
          this.actualizarEventos();
        }
      });

    this.authService.registerStatus$()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.userId = this.sessionStorageService.get('id');
        if (this.userId) {
          this.actualizarEventos();
        }
      });

    this.addReminderService.reminderAdded$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        if (this.userId) {
          this.actualizarEventos();
        }
      });
  }

  addReminderFunction(object: any): void {
    this.addReminder.emit(object);
  }

  editReminderFunction(recordatorio: Recordatorio) {
    this.editReminder.emit(recordatorio);
  }

  showDetailsFunction(event: Recordatorio | Evento) {
    this.showDetails.emit(event);

  }

  async actualizarEventos(): Promise<void> {
    // const eventos = await this.eventoService.getEventos(this.userId);
    const recordatorios = await this.recordatorioService.getRecordatorios(this.userId);
    // this.eventos = [...eventos, ...recordatorios];
    this.eventos = recordatorios;
  }

  diaDelMesEnSemanaActual(diaDeLaSemana: number) {
    const hoy = new Date();
    let diaSemanaActual = hoy.getDay();
    diaSemanaActual = diaSemanaActual === 0 ? 6 : diaSemanaActual - 1;

    let diferencia = diaDeLaSemana - diaSemanaActual;
    hoy.setDate(hoy.getDate() + diferencia);
    return hoy.getDate();
  }




  seMuestraEvento(evento: (Recordatorio | Evento), tiempo: any, vista: string, diaIndex?: number): boolean {
    const eventoInicio: Date = evento.start_date;
    const eventoFin: Date = evento.end_date;
    const hoy = new Date();
    const eventoHora = eventoInicio.getHours();
    let horaString;
    let monthDay: number = tiempo.type ? tiempo.value : diaIndex;

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
        const fechaSeleccionadaDia = new Date(this.anoActual, this.mesActual, monthDay, hoy.getHours(), hoy.getMinutes(), hoy.getSeconds());
        fechaSeleccionadaDia.setMinutes(fechaSeleccionadaDia.getMinutes() + 2);
        if ((evento.repeat === 'diario' && fechaSeleccionadaDia >= hoy)||
            (evento.repeat === 'ninguno' && esMismoDia(eventoInicio, hoy)) ||
            (evento.repeat === 'semanal' && diaSemanaEvento === diaSemanaHoy && fechaSeleccionadaDia >= hoy) ||
            (evento.repeat === 'mensual' && eventoInicio.getDate() === hoy.getDate() && fechaSeleccionadaDia >= hoy) ||
            (evento.repeat === 'anual' && eventoInicio.getMonth() === hoy.getMonth() && eventoInicio.getDate() === hoy.getDate()) && fechaSeleccionadaDia >= hoy) {
          return eventoHora >= parseInt(horaString, 10) && eventoHora <= parseInt(horaString, 10) + 1
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

            eventoInicioDia = eventoInicioDia === 0 ? 6 : eventoInicioDia - 1;
          eventoFinDia = eventoFinDia === 0 ? 6 : eventoFinDia - 1;

          const fechaSeleccionadaSemana = new Date(this.anoActual, this.mesActual, monthDay, hoy.getHours(), hoy.getMinutes(), hoy.getSeconds());
          fechaSeleccionadaSemana.setMinutes(fechaSeleccionadaSemana.getMinutes() + 2);
          const fechaSeleccionadaDiaSemana = fechaSeleccionadaSemana.getDay() === 0 ? 6 : fechaSeleccionadaSemana.getDay() - 1;

          const esEventoEnSemanaActual = (fecha: Date) => {
            const diaDelMes = fecha.getDate();
            return diaDelMes >= primerDiaSemana && diaDelMes <= ultimoDiaSemana;
          };

          switch (evento.repeat) {
            case 'diario':
              return eventoHora >= parseInt(horaString, 10) && eventoHora <= parseInt(horaString, 10) + 1 && fechaSeleccionadaSemana >= hoy;

            case 'semanal':
              console.log(fechaSeleccionadaSemana, hoy);
              return eventoInicioDia === fechaSeleccionadaDiaSemana && fechaSeleccionadaSemana >= hoy && eventoHora >= parseInt(horaString, 10) && eventoHora <= parseInt(horaString, 10) + 1;

            case 'mensual':
              return eventoInicioDia === fechaSeleccionadaDiaSemana && eventoInicio.getDate() === this.fechaActual.getDate() && fechaSeleccionadaSemana >= hoy && esEventoEnSemanaActual(eventoInicio) && eventoHora >= parseInt(horaString, 10) && eventoHora <= parseInt(horaString, 10) + 1;

            case 'anual':
              return eventoInicioDia === fechaSeleccionadaDiaSemana && eventoInicio.getMonth() === this.fechaActual.getMonth() && fechaSeleccionadaSemana >= hoy && eventoInicio.getDate() === this.fechaActual.getDate() && eventoHora >= parseInt(horaString, 10) && eventoHora <= parseInt(horaString, 10) + 1;

            case 'ninguno':
              return eventoInicio.getDate() >= primerDiaSemana && eventoInicio.getDate() <= ultimoDiaSemana && eventoHora >= parseInt(horaString, 10) && eventoHora <= parseInt(horaString, 10) + 1 && eventoInicioDia === fechaSeleccionadaDiaSemana;

            default:
              return false;
          }
          case 'mes':
            const diaDelMesEvento = eventoInicio.getDate();
            const mesEvento = eventoInicio.getMonth();
            const añoEvento = eventoInicio.getFullYear();
            const fechaSeleccionada = new Date(this.anoActual, this.mesActual, tiempo.value, 23, 59);

            switch (evento.repeat) {
              case 'diario':
                return tiempo.type === 'normal' && fechaSeleccionada >= hoy;

              case 'semanal':
                const diaCasilla = new Date(this.anoActual, this.mesActual, tiempo.value).getDay();
                return diaCasilla === eventoInicio.getDay() && fechaSeleccionada >= hoy && tiempo.type === 'normal';

              case 'mensual':
                return diaDelMesEvento === tiempo.value && fechaSeleccionada >= hoy && tiempo.type === 'normal';

              case 'anual':
                return diaDelMesEvento === tiempo.value && fechaSeleccionada >= hoy && mesEvento === this.mesActual && tiempo.type === 'normal';

              case 'ninguno':
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


  eliminarEvento(evento: Recordatorio | Evento): void {
    if(evento.type === 'evento'){
      this.eventoService.deleteEvento(this.userId, evento._id);
    }else if(evento.type === 'recordatorio'){
      console.log('evento', evento);
      this.recordatorioService.deleteRecordatorio(evento._id);
    }
    this.eventos = this.eventos.filter(e => e._id !== evento._id);
  }
}
