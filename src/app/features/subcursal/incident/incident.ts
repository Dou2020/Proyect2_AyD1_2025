import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IncidentService } from '../../../core/services/backoffice/incident.service';
import { IncidentModel } from '../../../core/models/backoffice/incident.model';

@Component({
  selector: 'app-incident',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './incident.html',
  styleUrl: './incident.css'
})
export class Incident implements OnInit {
  reportedIncidents = signal<IncidentModel[]>([]);
  resolvedIncidents = signal<IncidentModel[]>([]);
  filteredReportedIncidents = signal<IncidentModel[]>([]);
  filteredResolvedIncidents = signal<IncidentModel[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  activeTab = signal<'reported' | 'resolved'>('reported');
  showCreateForm = signal(false);
  isCreating = signal(false);
  searchTerm = signal('');
  selectedFile = signal<File | null>(null);

  createIncidentForm: FormGroup;

  constructor(
    private incidentService: IncidentService,
    private fb: FormBuilder
  ) {
    this.createIncidentForm = this.fb.group({
      ticketId: ['', [Validators.required, Validators.min(1)]],
      notes: ['', [Validators.required, Validators.minLength(10)]],
      status: ['REPORTED'],
      isInGroup: [false]
    });
  }

  ngOnInit() {
    this.loadReportedIncidents();
    this.loadResolvedIncidents();
  }

  loadReportedIncidents() {
    this.isLoading.set(true);
    this.incidentService.getReportedIncidents().subscribe({
      next: (incidents) => {
        this.reportedIncidents.set(incidents);
        this.filteredReportedIncidents.set(incidents);
        this.applySearch();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading reported incidents:', error);
        this.error.set('Error al cargar incidencias reportadas');
        this.isLoading.set(false);
      }
    });
  }

  loadResolvedIncidents() {
    this.incidentService.getResolvedIncidents().subscribe({
      next: (incidents) => {
        this.resolvedIncidents.set(incidents);
        this.filteredResolvedIncidents.set(incidents);
        this.applySearch();
      },
      error: (error) => {
        console.error('Error loading resolved incidents:', error);
        this.error.set('Error al cargar incidencias resueltas');
      }
    });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      // Validar tipo de archivo (opcional)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
      if (allowedTypes.includes(file.type)) {
        this.selectedFile.set(file);
        this.error.set(null);
      } else {
        this.error.set('Tipo de archivo no permitido. Solo se aceptan imágenes, PDF y archivos de texto.');
        this.selectedFile.set(null);
        target.value = '';
      }
    } else {
      this.selectedFile.set(null);
    }
  }

  removeSelectedFile(): void {
    this.selectedFile.set(null);
    const fileInput = document.getElementById('evidenceFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  createIncident() {
    if (this.createIncidentForm.valid) {
      this.isCreating.set(true);
      this.error.set(null);

      const formValues = this.createIncidentForm.value;
      const incidentData = {
        ticketId: parseInt(formValues.ticketId),
        notes: formValues.notes,
        status: formValues.status as 'REPORTED' | 'RESOLVED',
        isInGroup: formValues.isInGroup
      };

      // Pasar el archivo solo si existe, de lo contrario pasar undefined
      const file = this.selectedFile() || undefined;

      this.incidentService.createIncident(incidentData, file).subscribe({
        next: (response) => {
          console.log('Incidencia creada exitosamente:', response);
          this.isCreating.set(false);
          this.showCreateForm.set(false);
          this.createIncidentForm.reset({
            status: 'REPORTED',
            isInGroup: false
          });
          this.selectedFile.set(null);
          // Limpiar el input file
          const fileInput = document.getElementById('evidenceFile') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }
          this.loadReportedIncidents();
          this.error.set(null);

          // Mostrar mensaje de éxito
          alert('Incidencia creada exitosamente');
        },
        error: (error) => {
          console.error('Error creating incident:', error);
          let errorMessage = 'Error al crear la incidencia';

          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          } else if (typeof error.error === 'string') {
            errorMessage = error.error;
          }

          this.error.set(errorMessage);
          this.isCreating.set(false);
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores de validación
      Object.keys(this.createIncidentForm.controls).forEach(key => {
        this.createIncidentForm.get(key)?.markAsTouched();
      });
      this.error.set('Por favor, complete todos los campos requeridos');
    }
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.applySearch();
  }

  applySearch() {
    const term = this.searchTerm().toLowerCase();

    if (!term) {
      this.filteredReportedIncidents.set(this.reportedIncidents());
      this.filteredResolvedIncidents.set(this.resolvedIncidents());
      return;
    }

    const filterIncidents = (incidents: IncidentModel[]) => {
      return incidents.filter(incident =>
        incident.id.toString().includes(term) ||
        incident.notes.toLowerCase().includes(term) ||
        incident.urlEvidence.toLowerCase().includes(term)
      );
    };

    this.filteredReportedIncidents.set(filterIncidents(this.reportedIncidents()));
    this.filteredResolvedIncidents.set(filterIncidents(this.resolvedIncidents()));
  }

  toggleCreateForm() {
    this.showCreateForm.update(show => !show);
    if (!this.showCreateForm()) {
      this.createIncidentForm.reset({
        status: 'REPORTED',
        isInGroup: false
      });
      this.selectedFile.set(null);
      this.error.set(null);
    }
  }

  resolveIncident(incidentId: number) {
    if (confirm('¿Está seguro de que desea marcar esta incidencia como resuelta?')) {
      this.incidentService.updateIncident(incidentId, { status: 'RESOLVED' }).subscribe({
        next: () => {
          this.loadReportedIncidents();
          this.loadResolvedIncidents();
        },
        error: (error) => {
          console.error('Error resolving incident:', error);
          this.error.set('Error al resolver la incidencia');
        }
      });
    }
  }

  setActiveTab(tab: 'reported' | 'resolved') {
    this.activeTab.set(tab);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'REPORTED': return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'REPORTED': return 'Reportada';
      case 'RESOLVED': return 'Resuelta';
      default: return status;
    }
  }
}
