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

  createIncidentForm: FormGroup;

  constructor(
    private incidentService: IncidentService,
    private fb: FormBuilder
  ) {
    this.createIncidentForm = this.fb.group({
      urlEvidence: ['', [Validators.required]],
      notes: ['', [Validators.required, Validators.minLength(10)]],
      userHadSubscription: [false],
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

  createIncident() {
    if (this.createIncidentForm.valid) {
      this.isCreating.set(true);
      const newIncident = {
        ...this.createIncidentForm.value,
        status: 'REPORTED' as const
      };

      this.incidentService.createIncident(newIncident).subscribe({
        next: () => {
          this.isCreating.set(false);
          this.showCreateForm.set(false);
          this.createIncidentForm.reset({
            userHadSubscription: false,
            isInGroup: false
          });
          this.loadReportedIncidents();
          this.error.set(null);
        },
        error: (error) => {
          console.error('Error creating incident:', error);
          this.error.set('Error al crear la incidencia');
          this.isCreating.set(false);
        }
      });
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
        userHadSubscription: false,
        isInGroup: false
      });
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
