import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportService } from '../../../core/services/admin/reports.service';
import {
  paramSucursalOccupationsModel,
  reportSucursalOccupationsModel,
  paramSucursalBillingModel,
  reportSucursalBillingModel,
  paramSubscriptionModel,
  reportSubscriptionModel,
  paramCommerceGivenBenefitsModel,
  reportCommerceGivenBenefitsModel,
  paramIncidentsModel,
  reportIncidentsModel
} from '../../../core/models/admin/report.model';

@Component({
  selector: 'app-reports',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {
  selectedReportType = signal<string>('occupations');
  loading = signal<boolean>(false);

  // Forms
  occupationsForm!: FormGroup;
  billingForm!: FormGroup;
  subscriptionForm!: FormGroup;
  commerceBenefitsForm!: FormGroup;
  incidentsForm!: FormGroup;

  // Reports data
  occupationsReport = signal<reportSucursalOccupationsModel | null>(null);
  billingReport = signal<reportSucursalBillingModel | null>(null);
  subscriptionReport = signal<reportSubscriptionModel[]>([]);
  commerceBenefitsReport = signal<reportCommerceGivenBenefitsModel[]>([]);
  incidentsReport = signal<reportIncidentsModel[]>([]);

  reportTypes = [
    { key: 'occupations', label: 'Ocupaciones por Sucursal' },
    { key: 'billing', label: 'Facturación por Sucursal' },
    { key: 'subscription', label: 'Reportes de Suscripciones' },
    { key: 'commerce', label: 'Beneficios a Comercios' },
    { key: 'incidents', label: 'Reportes de Incidentes' }
  ];

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.initializeForms();
  }

  initializeForms() {
    this.occupationsForm = this.fb.group({
      sucursalId: [null]
    });

    this.billingForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      sucursalId: [null]
    });

    this.subscriptionForm = this.fb.group({
      subscriptionPlanId: [null],
      activeOrInactive: [null],
      userId: [null],
      vehiclePlate: [null],
      startDate: [null],
      endDate: [null],
      vehicleId: [null]
    });

    this.commerceBenefitsForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      vehiclePlate: [null],
      commerceId: [null],
      clientId: [null]
    });

    this.incidentsForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      ticketId: [null],
      clientId: [null],
      vehiclePlate: [null],
      status: [null],
      description: [null]
    });
  }

  selectReportType(type: string) {
    this.selectedReportType.set(type);
    this.clearReports();
  }

  clearReports() {
    this.occupationsReport.set(null);
    this.billingReport.set(null);
    this.subscriptionReport.set([]);
    this.commerceBenefitsReport.set([]);
    this.incidentsReport.set([]);
  }

  generateOccupationsReport() {
    this.loading.set(true);
    const formValue = this.occupationsForm.value;
    const params: paramSucursalOccupationsModel = {
      sucursalId: formValue.sucursalId || null
    };

    this.reportService.getSucursalOccupationsReport(params).subscribe({
      next: (data) => {
        this.occupationsReport.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error generating occupations report:', error);
        this.loading.set(false);
      }
    });
  }

  generateBillingReport() {
    this.loading.set(true);
    const formValue = this.billingForm.value;
    const params: paramSucursalBillingModel = {
      startDate: formValue.startDate || null,
      endDate: formValue.endDate || null,
      sucursalId: formValue.sucursalId || null
    };

    this.reportService.getSucursalBillingReport(params).subscribe({
      next: (data) => {
        this.billingReport.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error generating billing report:', error);
        this.loading.set(false);
      }
    });
  }

  generateSubscriptionReport() {
    this.loading.set(true);
    const formValue = this.subscriptionForm.value;
    const params: paramSubscriptionModel = {
      subscriptionPlanId: formValue.subscriptionPlanId || null,
      activeOrInactive: formValue.activeOrInactive !== null ? formValue.activeOrInactive : null,
      userId: formValue.userId || null,
      vehiclePlate: formValue.vehiclePlate || null,
      startDate: formValue.startDate || null,
      endDate: formValue.endDate || null,
      vehicleId: formValue.vehicleId || null
    };

    this.reportService.getSubscriptionReport(params).subscribe({
      next: (data) => {
        this.subscriptionReport.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error generating subscription report:', error);
        this.loading.set(false);
      }
    });
  }

  generateCommerceBenefitsReport() {
    this.loading.set(true);
    const formValue = this.commerceBenefitsForm.value;
    const params: paramCommerceGivenBenefitsModel = {
      startDate: formValue.startDate || null,
      endDate: formValue.endDate || null,
      vehiclePlate: formValue.vehiclePlate || null,
      commerceId: formValue.commerceId || null,
      clientId: formValue.clientId || null
    };

    this.reportService.getCommerceGivenBenefitsReport(params).subscribe({
      next: (data) => {
        this.commerceBenefitsReport.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error generating commerce benefits report:', error);
        this.loading.set(false);
      }
    });
  }

  generateIncidentsReport() {
    this.loading.set(true);
    const formValue = this.incidentsForm.value;
    const params: paramIncidentsModel = {
      startDate: formValue.startDate || null,
      endDate: formValue.endDate || null,
      ticketId: formValue.ticketId || null,
      clientId: formValue.clientId || null,
      vehiclePlate: formValue.vehiclePlate || null,
      status: formValue.status || null,
      description: formValue.description || null
    };

    this.reportService.getIncidentsReport(params).subscribe({
      next: (data) => {
        this.incidentsReport.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error generating incidents report:', error);
        this.loading.set(false);
      }
    });
  }

  exportReport() {
    // Implementar lógica de exportación según el tipo de reporte
    console.log('Exporting report for type:', this.selectedReportType());
  }
}
