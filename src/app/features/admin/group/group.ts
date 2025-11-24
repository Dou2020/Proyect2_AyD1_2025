import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GroupService } from '../../../core/services/admin/group.service';
import { GroupModel, GroupCreateModel } from '../../../core/models/admin/group.model';
import { CommerceModel } from '../../../core/models/admin/commerce.model';
import { SubcursalModel } from '../../../core/models/admin/subcursal.model';

@Component({
  selector: 'app-group',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './group.html',
  styleUrl: './group.css'
})
export class Group implements OnInit {
  groups = signal<GroupModel[]>([]);
  filteredGroups = signal<GroupModel[]>([]);
  commerces = signal<CommerceModel[]>([]);
  subcursals = signal<SubcursalModel[]>([]);

  searchTerm = signal('');
  isLoading = signal(false);
  loadingCreate = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  showCreateModal = signal(false);

  groupForm: FormGroup;

  constructor(
    private groupService: GroupService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.groupForm = this.fb.group({
      sucursalId: ['', [Validators.required]],
      commerceId: ['', [Validators.required]],
      discount: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      from: ['', [Validators.required]],
      to: ['', [Validators.required]]
    });
  }

  // Computed property for filtered groups
  computedFilteredGroups = computed(() => {
    const groups = this.groups();
    const search = this.searchTerm().toLowerCase();

    if (!search) return groups;

    return groups.filter(group => {
      return group.sucursal.address.toLowerCase().includes(search) ||
             group.discount.toString().includes(search) ||
             group.from.toLowerCase().includes(search) ||
             group.to.toLowerCase().includes(search);
    });
  });

  ngOnInit() {
    this.loadGroups();
    this.loadCommerces();
    this.loadSubcursals();
  }

  loadGroups() {
    this.isLoading.set(true);
    this.error.set(null);

    this.groupService.getGroups().subscribe({
      next: (groups) => {
        this.groups.set(groups);
        this.filteredGroups.set(this.computedFilteredGroups());
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading groups:', error);
        this.error.set('Error al cargar los grupos');
        this.isLoading.set(false);
        this.clearMessagesAfterDelay();
      }
    });
  }

  loadCommerces() {
    this.groupService.getAllCommerces().subscribe({
      next: (commerces) => {
        this.commerces.set(commerces);
      },
      error: (error) => {
        console.error('Error loading commerces:', error);
      }
    });
  }

  loadSubcursals() {
    this.groupService.getAllSubcursals().subscribe({
      next: (subcursals) => {
        this.subcursals.set(subcursals);
      },
      error: (error) => {
        console.error('Error loading subcursals:', error);
      }
    });
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.filteredGroups.set(this.computedFilteredGroups());
  }

  openCreateModal() {
    this.showCreateModal.set(true);
    this.groupForm.reset();
    this.error.set(null);
    this.success.set(null);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
    this.groupForm.reset();
    this.error.set(null);
    this.success.set(null);
  }

  createGroup() {
    if (this.groupForm.invalid) {
      this.error.set('Por favor, completa todos los campos correctamente');
      this.clearMessagesAfterDelay();
      return;
    }

    // Validar que la fecha 'from' sea anterior a 'to'
    const fromDate = new Date(this.groupForm.value.from);
    const toDate = new Date(this.groupForm.value.to);

    if (fromDate >= toDate) {
      this.error.set('La fecha de inicio debe ser anterior a la fecha de fin');
      this.clearMessagesAfterDelay();
      return;
    }

    const payload: GroupCreateModel = {
      sucursalId: parseInt(this.groupForm.value.sucursalId),
      commerceId: parseInt(this.groupForm.value.commerceId),
      discount: parseFloat(this.groupForm.value.discount),
      from: this.groupForm.value.from,
      to: this.groupForm.value.to
    };

    this.loadingCreate.set(true);
    this.error.set(null);

    this.groupService.createGroup(payload).subscribe({
      next: (response) => {
        console.log('Grupo creado exitosamente:', response);
        this.success.set('Grupo creado exitosamente');
        this.loadingCreate.set(false);
        this.closeCreateModal();
        this.loadGroups(); // Recargar la lista
        this.clearMessagesAfterDelay();
      },
      error: (error) => {
        console.error('Error creating group:', error);
        this.error.set('Error al crear el grupo');
        this.loadingCreate.set(false);
        this.clearMessagesAfterDelay();
      }
    });
  }

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.error.set(null);
      this.success.set(null);
    }, 5000);
  }

  // Utility methods
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  isGroupActive(group: GroupModel): boolean {
    const now = new Date();
    const from = new Date(group.from);
    const to = new Date(group.to);

    return now >= from && now <= to;
  }

  getGroupStatusClass(group: GroupModel): string {
    if (this.isGroupActive(group)) {
      return 'bg-green-100 text-green-800';
    } else {
      const now = new Date();
      const from = new Date(group.from);

      if (now < from) {
        return 'bg-yellow-100 text-yellow-800';
      } else {
        return 'bg-red-100 text-red-800';
      }
    }
  }

  getGroupStatusText(group: GroupModel): string {
    if (this.isGroupActive(group)) {
      return 'Activo';
    } else {
      const now = new Date();
      const from = new Date(group.from);

      if (now < from) {
        return 'Próximo';
      } else {
        return 'Expirado';
      }
    }
  }

  trackByGroup(index: number, item: GroupModel): number {
    return item.id;
  }

  // Navegación a ticket group
  viewGroupTickets(groupId: number) {
    this.router.navigate(['/admin/grupos', groupId, 'tickets']);
  }
}
