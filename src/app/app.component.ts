import {
  Component,
  OnInit,
  HostListener,
  Inject,
  PLATFORM_ID,
  OnDestroy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  // Array de frases motivacionales de deportes
  sportQuotes: { quote: string; author: string }[] = [
    {
      quote: 'Los campeones siguen jugando hasta que lo hacen bien.',
      author: 'Billie Jean King',
    },
    {
      quote:
        'Nunca digas nunca porque los límites, como los miedos, a menudo son solo ilusiones.',
      author: 'Michael Jordan',
    },
    {
      quote: 'No es si te derriban, es si te levantas.',
      author: 'Vince Lombardi',
    },
    {
      quote:
        'El talento gana partidos, pero el trabajo en equipo y la inteligencia ganan campeonatos.',
      author: 'Michael Jordan',
    },
  ];

  // Array de logros deportivos históricos
  sportAchievements: { team: string; achievement: string; year: string }[] = [
    {
      team: 'Real Madrid',
      achievement: '14 Títulos de Champions League',
      year: '1956-2022',
    },
    {
      team: 'LA Lakers',
      achievement: '17 Campeonatos de la NBA',
      year: '1949-2020',
    },
    {
      team: 'New York Yankees',
      achievement: '27 Series Mundiales',
      year: '1923-2009',
    },
    {
      team: 'All Blacks',
      achievement: '3 Copas del Mundo de Rugby',
      year: '1987-2015',
    },
  ];

  // Citas actuales e índice para la animación
  currentQuoteIndex: number = 0;
  activeQuote: { quote: string; author: string } = this.sportQuotes[0];

  // Propiedad para controlar si el navbar es visible en mobile
  isMobileMenuOpen: boolean = false;
  isMobile: boolean = false;

  // Flag para verificar si estamos en el navegador
  private isBrowser: boolean;

  // Propiedades para el temporizador de cuenta regresiva
  launchDate: Date;
  countdown: CountdownTime = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  private countdownInterval: any;
  isLaunched: boolean = false;

  progressPercentage: number = 0;
  private startDate: Date;

  constructor(
  private router: Router,
  @Inject(PLATFORM_ID) private platformId: Object
) {
  this.isBrowser = isPlatformBrowser(this.platformId);
  
  // Fecha de lanzamiento fija
  this.launchDate = new Date('2025-07-11T12:00:00');
  
  // Fecha de inicio del proyecto (3 semanas antes del lanzamiento)
  this.startDate = new Date('2025-06-20T12:00:00');
}

  ngOnInit(): void {
    if (this.isBrowser) {
      this.checkScreenSize();
      this.initCountdown();

      // Cambio automático de citas cada 8 segundos
      setInterval(() => {
        this.currentQuoteIndex =
          (this.currentQuoteIndex + 1) % this.sportQuotes.length;
        this.activeQuote = this.sportQuotes[this.currentQuoteIndex];
      }, 8000);
    } else {
      // Valores por defecto para cuando estamos en el servidor
      this.isMobile = false;
      this.updateCountdown(); // Calcular valores iniciales para SSR
    }
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.isBrowser) {
      this.checkScreenSize();
    }
  }

  // Inicializar el temporizador de cuenta regresiva
  initCountdown(): void {
    this.updateCountdown();

    // Actualizar cada segundo
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  // Actualizar los valores del temporizador
  updateCountdown(): void {
  const now = new Date().getTime();
  const distance = this.launchDate.getTime() - now;

  if (distance < 0) {
    this.isLaunched = true;
    this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    this.progressPercentage = 100;
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    return;
  }

  // Calcular countdown
  this.countdown = {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000)
  };

  // Calcular progreso dinámico
  const totalDuration = this.launchDate.getTime() - this.startDate.getTime();
  const elapsed = now - this.startDate.getTime();
  this.progressPercentage = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
}

  // Verificar el tamaño de pantalla para ajustar la UI
  checkScreenSize() {
    if (this.isBrowser) {
      this.isMobile = window.innerWidth < 768; // 768px es el breakpoint de md en Tailwind
    }
  }

  // Toggle para el menú móvil
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Método para desplazamiento suave a secciones
  scrollToSection(sectionId: string): void {
    if (this.isBrowser) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  // Método para notificar cuando esté listo
  notifyWhenReady(): void {
    // Aquí puedes implementar la lógica para recopilar emails
    // Por ahora, solo mostramos un alert
    if (this.isBrowser) {
      alert(
        '¡Gracias por tu interés! Te notificaremos cuando TIPS-ZONE esté listo.'
      );
    }
  }
}
