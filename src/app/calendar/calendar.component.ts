import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Evento {
  id: number;
  titulo: string;
  inicio: Date;
  fin: Date;
  descripcion?: string;
  tipo?: string;
  color?: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  diasMes: number[] = [];
  horas: string[] = [];
  anoActual: number = 0;
  mesActual: number = 0;
  mesActualNombre: string = '';
  nombresMeses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  vistaActual: string = 'mes';
  fechaActual: Date = new Date();

  eventos: Evento[] = [
    { id: 1, titulo: 'Reunión de equipo', inicio: new Date(2024, 2, 7, 10, 0), fin: new Date(2024, 2, 7, 11, 0), descripcion: 'Reunión semanal del equipo', tipo: 'recordatorio', color: 'red' },
    { id: 2, titulo: 'Cita con el médico', inicio: new Date(2024, 2, 8, 16, 0), fin: new Date(2024, 2, 8, 16, 30), descripcion: 'Chequeo anual', tipo: 'evento', color: 'green'},
    { id: 3, titulo: 'Cita con Juan', inicio: new Date(2024, 2, 8, 16, 0), fin: new Date(2024, 2, 8, 16, 30), descripcion: 'Quedé con juan en la pizzería', tipo: 'recordatorio', color: 'blue'},
  ];

  ngOnInit(): void {
    this.anoActual = this.fechaActual.getFullYear();
    this.mesActual = this.fechaActual.getMonth();
    this.mesActualNombre = this.nombresMeses[this.mesActual];
    this.calculateDaysForCalendar();
    this.inicializarHoras();
  }

  seMuestraEvento(evento: Evento, tiempo: any, vista: string, diaIndex?: number): boolean {
    const eventoInicio = evento.inicio;
    const eventoFin = evento.fin;
    const eventoHora = eventoInicio.getHours();
    let horaString: string;

    switch (vista) {
      case 'dia':
        // Suponiendo que 'hora' está en formato 'HH:00'
        horaString = tiempo.split(':');
        return eventoInicio.getDate() === this.fechaActual.getDate() && parseInt(horaString, 10) === eventoHora;
      case 'semana':
        //comprueba si el dia esta en la semana de la fecha actual y si esta entre la hora de inicio y fin del evento
        horaString = tiempo.split(':');
        const diasSemana = this.fechaActual.getDay();
        const primerDiaSemana = this.fechaActual.getDate() - diasSemana;
        const ultimoDiaSemana = primerDiaSemana + 6;
        return eventoInicio.getDate() >= primerDiaSemana && eventoInicio.getDate() <= ultimoDiaSemana && eventoInicio.getHours() >= parseInt(horaString, 10) && eventoInicio.getHours() <= parseInt(horaString, 10)+1 && eventoInicio.getDay() === diaIndex;
        
      case 'mes':
        // 'tiempo' es el día del mes
        return eventoInicio.getDate() === tiempo;
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
    
      for (let i = 1; i <= ultimoDiaMes.getDate(); i++) {
        this.diasMes.push(i);
      }
    
      // Ajustar los días del mes anterior para completar la semana
      const primerDiaSemana = primerDiaMes.getDay();
      const ultimoDiaMesAnterior = new Date(this.anoActual, this.mesActual, 0).getDate();
      for (let i = ultimoDiaMesAnterior - primerDiaSemana + 1; i <= ultimoDiaMesAnterior; i++) {
        this.diasMes.unshift(i);
      }
    
      // Ajustar los días del mes siguiente para completar la semana
      const ultimoDiaSemana = ultimoDiaMes.getDay();
      for (let i = 1; i < 7 - ultimoDiaSemana; i++) {
        this.diasMes.push(i);
      }
    }else if (this.vistaActual === 'semana') {
      const fechaActual = new Date();
      const primerDiaSemana = fechaActual.getDate() - fechaActual.getDay();
      const ultimoDiaSemana = primerDiaSemana + 6;
      this.diasMes = [];
      for (let i = primerDiaSemana; i <= ultimoDiaSemana; i++) {
        this.diasMes.push(i);
      }
    }else{
        this.diasMes = [this.fechaActual.getDate()];
    }
  }

  eliminarEvento(evento: Evento): void {
    this.eventos = this.eventos.filter(e => e.id !== evento.id);
  }

}
