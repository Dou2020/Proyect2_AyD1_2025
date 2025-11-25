import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/admin/users.service';
import { UserModel, CommerceCreateModel, UserUpdateModel } from '../../../core/models/admin/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {
  users = signal<UserModel[]>([]);
  filteredUsers = signal<UserModel[]>([]);
  searchTerm = signal('');
  selectedRole = signal<string>('all');
  isLoading = signal(false);
  showModal = signal(false);
  isEditing = signal(false);
  currentUser = signal<UserModel | null>(null);
  userForm: FormGroup;
  userEditForm: FormGroup;
  commerceForm: FormGroup;
  isCommerceMode = signal(false);

  // Available roles (excluding ADMIN)
  availableRoles = ['CLIENT', 'COMMERCE', 'SUCURSAL', 'BACKOFFICE'];
  statusOptions = ['ACTIVE', 'INACTIVE'];

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      name: ['', Validators.required],
      username: ['', Validators.required],
      role: ['', Validators.required],
      status: ['ACTIVE', Validators.required],
      mfaActivated: [false],
      daysToPay: [30, [Validators.required, Validators.min(1)]]
    });

    // Formulario específico para edición con campos del UserUpdateModel
    this.userEditForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      status: ['ACTIVE', Validators.required],
      mfaActivated: [false]
    });

    this.commerceForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      name: ['', Validators.required],
      username: ['', Validators.required],
      mfaActivated: [false]
    });
  }

  // Computed property for filtered users based on search and role filter
  computedFilteredUsers = computed(() => {
    const users = this.users();
    const search = this.searchTerm().toLowerCase();
    const role = this.selectedRole();

    return users.filter(user => {
      // Exclude ADMIN users
      if (user.role === 'ADMIN') return false;

      const matchesSearch =
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.username.toLowerCase().includes(search) ||
        user.phoneNumber.includes(search);

      const matchesRole = role === 'all' || user.role === role;

      return matchesSearch && matchesRole;
    });
  });

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.filteredUsers.set(this.computedFilteredUsers());
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading.set(false);
      }
    });
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.filteredUsers.set(this.computedFilteredUsers());
  }

  onRoleFilter(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedRole.set(target.value);
    this.filteredUsers.set(this.computedFilteredUsers());
  }

  openModal(user?: UserModel) {
    this.isEditing.set(!!user);
    this.currentUser.set(user || null);
    this.isCommerceMode.set(false);

    if (user) {
      // Para edición, usar userEditForm con campos permitidos en UserUpdateModel
      this.userEditForm.patchValue({
        email: user.email,
        name: user.name,
        username: user.username,
        status: user.status,
        mfaActivated: user.mfaActivated
      });
    } else {
      // Para crear nuevo usuario, usar userForm completo
      this.userForm.reset({
        status: 'ACTIVE',
        mfaActivated: false,
        daysToPay: 30
      });
    }

    this.showModal.set(true);
  }

  openCommerceModal() {
    this.isEditing.set(false);
    this.currentUser.set(null);
    this.isCommerceMode.set(true);
    this.commerceForm.reset({
      mfaActivated: false
    });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.isEditing.set(false);
    this.currentUser.set(null);
    this.isCommerceMode.set(false);
    this.userForm.reset();
    this.userEditForm.reset();
    this.commerceForm.reset();
  }

  saveUser() {
    // Determinar qué formulario usar según si estamos editando o creando
    const formToValidate = this.isEditing() ? this.userEditForm : this.userForm;

    if (formToValidate.invalid) return;

    const formData = formToValidate.value;
    this.isLoading.set(true);

    if (this.isEditing()) {
      const currentUser = this.currentUser();
      if (currentUser) {
        // Para actualización, usar UserUpdateModel
        const updateData: Partial<UserUpdateModel> = {
          username: formData.username,
          email: formData.email,
          name: formData.name,
          status: formData.status,
          mfaActivated: formData.mfaActivated
        };

        this.userService.updateUser(currentUser.id, updateData).subscribe({
          next: (updatedUser) => {
            const users = this.users();
            const index = users.findIndex(u => u.id === updatedUser.id);
            if (index !== -1) {
              users[index] = updatedUser;
              this.users.set([...users]);
              this.filteredUsers.set(this.computedFilteredUsers());
            }
            this.closeModal();
            this.isLoading.set(false);
          },
          error: (error) => {
            console.error('Error updating user:', error);
            this.isLoading.set(false);
          }
        });
      }
    } else {
      // Para crear nuevo usuario, usar todos los campos del UserModel
      this.userService.registerUser(formData).subscribe({
        next: (newUser) => {
          this.users.set([...this.users(), newUser]);
          this.filteredUsers.set(this.computedFilteredUsers());
          this.closeModal();
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.isLoading.set(false);
        }
      });
    }
  }

  saveCommerce() {
    if (this.commerceForm.invalid) return;

    const formData: CommerceCreateModel = this.commerceForm.value;
    this.isLoading.set(true);

    this.userService.registerCommerce(formData).subscribe({
      next: (newCommerce) => {
        this.users.set([...this.users(), newCommerce]);
        this.filteredUsers.set(this.computedFilteredUsers());
        this.closeModal();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error creating commerce:', error);
        this.isLoading.set(false);
      }
    });
  }

  deleteUser(user: UserModel) {
    if (confirm(`¿Estás seguro de que deseas eliminar al usuario ${user.name}?`)) {
      this.isLoading.set(true);
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          const users = this.users().filter(u => u.id !== user.id);
          this.users.set(users);
          this.filteredUsers.set(this.computedFilteredUsers());
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.isLoading.set(false);
        }
      });
    }
  }

  getRoleBadgeClass(role: string): string {
    const roleClasses = {
      'CLIENT': 'bg-blue-100 text-blue-800',
      'COMMERCE': 'bg-green-100 text-green-800',
      'SUCURSAL': 'bg-purple-100 text-purple-800',
      'BACKOFFICE': 'bg-orange-100 text-orange-800'
    };
    return roleClasses[role as keyof typeof roleClasses] || 'bg-gray-100 text-gray-800';
  }

  getStatusBadgeClass(status: string): string {
    return status === 'ACTIVE'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  }
}
