import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/admin/users.service';
import { UserModel } from '../../../core/models/admin/user.model';

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

    if (user) {
      this.userForm.patchValue({
        email: user.email,
        phoneNumber: user.phoneNumber,
        name: user.name,
        username: user.username,
        role: user.role,
        status: user.status,
        mfaActivated: user.mfaActivated,
        daysToPay: user.daysToPay
      });
    } else {
      this.userForm.reset({
        status: 'ACTIVE',
        mfaActivated: false,
        daysToPay: 30
      });
    }

    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.isEditing.set(false);
    this.currentUser.set(null);
    this.userForm.reset();
  }

  saveUser() {
    if (this.userForm.invalid) return;

    const formData = this.userForm.value;
    this.isLoading.set(true);

    if (this.isEditing()) {
      const currentUser = this.currentUser();
      if (currentUser) {
        this.userService.updateUser(currentUser.id, formData).subscribe({
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
