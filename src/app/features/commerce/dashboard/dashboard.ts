import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlertService } from '../../utils/alert-modal/alert.service';
import { CommerceService } from '../../../core/services/commerce/commerce.service';
import { LiquidationService } from '../../../core/services/commerce/liquidation.service';
import { DiscountService } from '../../../core/services/commerce/discount.service';
import { AffiliateSubcursalModel } from '../../../core/models/admin/commerce.model';
import { LiquidationModel } from '../../../core/models/commerce/liquidation.model';
import { DiscountModel } from '../../../core/models/commerce/discount.model';
import { forkJoin, catchError, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  // Datos del dashboard
  subcursals: AffiliateSubcursalModel[] = [];
  totalSubcursals = 0;
  activeDiscounts = 0;
  todayRevenue = 0;
  totalDiscountAmount = 0;
  recentLiquidations: LiquidationModel[] = [];
  recentDiscounts: DiscountModel[] = [];

  // Estados de carga
  loading = true;
  loadingSubcursals = false;
  loadingDiscounts = false;
  loadingLiquidations = false;

  // Mock commerce ID - en un caso real vendría del auth service
  private commerceId = 1;

  constructor(
    private alertService: AlertService,
    private commerceService: CommerceService,
    private liquidationService: LiquidationService,
    private discountService: DiscountService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.alertService.showSuccess('Panel de comercio cargado correctamente');
  }

  private loadDashboardData(): void {
    this.loading = true;

    // Obtener la fecha de hoy para las liquidaciones y descuentos
    const today = new Date().toISOString().split('T')[0];
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    // Cargar datos en paralelo
    forkJoin({
      subcursals: this.commerceService.getSubcursals(this.commerceId).pipe(
        catchError(error => {
          console.error('Error loading subcursals:', error);
          this.alertService.showError('Error al cargar subcursales');
          return of([]);
        })
      ),
      discounts: this.discountService.getDiscounts({
        startDate: startOfMonth,
        endDate: today,
        plate: null,
        ticketId: null
      }).pipe(
        catchError(error => {
          console.error('Error loading discounts:', error);
          this.alertService.showError('Error al cargar descuentos');
          return of([]);
        })
      ),
      liquidation: this.liquidationService.getLiquidation({
        startDate: startOfMonth,
        endDate: today
      }).pipe(
        catchError(error => {
          console.error('Error loading liquidation:', error);
          this.alertService.showWarning('No hay liquidaciones disponibles para este período');
          return of(null);
        })
      )
    }).subscribe({
      next: (data) => {
        this.processLoadedData(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.alertService.showError('Error al cargar datos del dashboard');
        this.loading = false;
      }
    });
  }

  private processLoadedData(data: any): void {
    // Procesar subcursales
    this.subcursals = data.subcursals || [];
    this.totalSubcursals = this.subcursals.length;

    // Procesar descuentos
    this.recentDiscounts = data.discounts || [];
    this.activeDiscounts = this.recentDiscounts.filter(discount => !discount.used).length;
    this.totalDiscountAmount = this.recentDiscounts.reduce((total, discount) => total + discount.costs, 0);

    // Procesar liquidación
    if (data.liquidation) {
      this.todayRevenue = data.liquidation.totalToPay;
      this.recentLiquidations = [data.liquidation];
    }

    // Mostrar alertas según el estado de los datos
    if (this.activeDiscounts > 10) {
      this.alertService.showWarning(`Tienes ${this.activeDiscounts} descuentos activos pendientes`);
    }

    if (this.totalSubcursals === 0) {
      this.alertService.showInfo('No tienes subcursales afiliadas. Considera afiliarte a una subcursal.');
    }
  }

  // Navegación a diferentes secciones
  navigateToSubcursals(): void {
    this.alertService.showInfo('Redirigiendo a gestión de subcursales...');
    // En una implementación real, usarías el router
    // this.router.navigate(['/commerce/subcursal']);
  }

  navigateToDiscounts(): void {
    this.alertService.showInfo('Redirigiendo a gestión de descuentos...');
    // this.router.navigate(['/commerce/descuentos']);
  }

  navigateToLiquidations(): void {
    this.alertService.showInfo('Redirigiendo a liquidaciones...');
    // this.router.navigate(['/commerce/liquidacion']);
  }

  navigateToReports(): void {
    this.alertService.showInfo('Redirigiendo a reportes...');
    // this.router.navigate(['/commerce/reportes']);
  }

  // Acciones rápidas
  createDiscount(): void {
    this.alertService.showInfo('Abriendo formulario para crear descuento...');

    // Simulación de creación de descuento
    setTimeout(() => {
      this.loadingDiscounts = true;
      this.discountService.createDiscount({
        hours: 2,
        ticketIdOrPlate: 'ABC123'
      }).subscribe({
        next: (discount) => {
          this.recentDiscounts.unshift(discount);
          this.activeDiscounts++;
          this.alertService.showSuccess('Descuento creado exitosamente');
          this.loadingDiscounts = false;
        },
        error: (error) => {
          console.error('Error creating discount:', error);
          this.alertService.showError('Error al crear descuento');
          this.loadingDiscounts = false;
        }
      });
    }, 1000);
  }

  generateLiquidation(): void {
    this.alertService.showInfo('Generando liquidación...');
    this.loadingLiquidations = true;

    const today = new Date().toISOString().split('T')[0];
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    this.liquidationService.createLiquidation({
      startDate: startOfMonth,
      endDate: today
    }).subscribe({
      next: (liquidation) => {
        this.recentLiquidations.unshift(liquidation);
        this.todayRevenue = liquidation.totalToPay;
        this.alertService.showSuccess('Liquidación generada exitosamente');
        this.loadingLiquidations = false;
      },
      error: (error) => {
        console.error('Error creating liquidation:', error);
        this.alertService.showError('Error al generar liquidación');
        this.loadingLiquidations = false;
      }
    });
  }

  affiliateToSubcursal(): void {
    this.alertService.showInfo('Redirigiendo a afiliación de subcursales...');
    this.loadingSubcursals = true;

    // Simular proceso de afiliación
    setTimeout(() => {
      this.loadingSubcursals = false;
      this.navigateToSubcursals();
    }, 2000);
  }

  refreshData(): void {
    this.alertService.showInfo('Actualizando datos...');
    this.loadDashboardData();
  }

  simulateError(): void {
    this.alertService.showError('Error de conexión con el sistema de pagos', 502);
  }

  clearAllAlerts(): void {
    this.alertService.clearAll();
  }
}
