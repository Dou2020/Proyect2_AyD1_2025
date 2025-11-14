import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionService } from '../../../core/services/admin/subscription.service';
import {
  SubscriptionModel,
  SubscriptionDTO,
  WeekDay,
  createSubscription,
  subscriptionToDTO,
  daysToBitmask,
  bitmaskToDays
} from '../../../core/models/admin/subscription.model';

@Component({
  selector: 'app-subscription',
  imports: [CommonModule, ReactiveFormsModule, DecimalPipe],
  templateUrl: './subscription.html',
  styleUrl: './subscription.css'
})
export class Subscription implements OnInit {
  subscriptions = signal<SubscriptionModel[]>([]);
  isLoading = signal(false);
  showModal = signal(false);
  isEditing = signal(false);
  editingId = signal<number | null>(null);

  subscriptionForm: FormGroup;
  WeekDayEnum = WeekDay;

  constructor(
    private subscriptionService: SubscriptionService,
    private fb: FormBuilder
  ) {
    this.subscriptionForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      freeHoursPerMonth: [0, [Validators.required, Validators.min(0)]],
      pricePerMonth: [0, [Validators.required, Validators.min(0)]],
      baseDiscount: [0, [Validators.min(0), Validators.max(100)]],
      yearDiscount: [0, [Validators.min(0), Validators.max(100)]],
      description: [''],
      isBySchedule: [false],
      weight: [0, [Validators.min(0)]],
      days: this.fb.group({
        [WeekDay.MONDAY]: [false],
        [WeekDay.TUESDAY]: [false],
        [WeekDay.WEDNESDAY]: [false],
        [WeekDay.THURSDAY]: [false],
        [WeekDay.FRIDAY]: [false],
        [WeekDay.SATURDAY]: [false],
        [WeekDay.SUNDAY]: [false]
      })
    });
  }

  loadSubscriptions(): void {
    this.isLoading.set(true);
    this.subscriptionService.getSubscriptions().subscribe({
      next: (subscriptions) => {
        this.subscriptions.set(subscriptions.map(dto => createSubscription(dto as any)));
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading subscriptions:', error);
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.subscriptionForm.reset();
    this.showModal.set(true);
  }

  openEditModal(subscription: SubscriptionModel): void {
    this.isEditing.set(true);
    this.editingId.set(subscription.id);

    // Populate form with subscription data
    const daysControl = this.subscriptionForm.get('days') as FormGroup;
    Object.values(WeekDay).forEach(day => {
      daysControl.get(day)?.setValue(subscription.days.includes(day));
    });

    this.subscriptionForm.patchValue({
      name: subscription.name,
      freeHoursPerMonth: subscription.freeHoursPerMonth,
      pricePerMonth: subscription.pricePerMonth,
      baseDiscount: subscription.baseDiscount,
      yearDiscount: subscription.yearDiscount,
      description: subscription.description,
      isBySchedule: subscription.isBySchedule,
      weight: subscription.weight
    });

    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.subscriptionForm.reset();
  }

  onSubmit(): void {
    if (this.subscriptionForm.valid) {
      const formValue = this.subscriptionForm.value;
      const selectedDays: WeekDay[] = [];

      // Extract selected days
      const daysForm = formValue.days;
      Object.keys(daysForm).forEach(day => {
        if (daysForm[day]) {
          selectedDays.push(day as WeekDay);
        }
      });

      const subscriptionData: Partial<SubscriptionModel> = {
        name: formValue.name,
        freeHoursPerMonth: formValue.freeHoursPerMonth,
        pricePerMonth: formValue.pricePerMonth,
        baseDiscount: formValue.baseDiscount,
        yearDiscount: formValue.yearDiscount,
        description: formValue.description || null,
        isBySchedule: formValue.isBySchedule,
        weight: formValue.weight,
        daysBitmask: daysToBitmask(selectedDays),
        days: selectedDays
      };

      if (this.isEditing()) {
        this.updateSubscription(this.editingId()!, subscriptionData);
      } else {
        this.createSubscription(subscriptionData);
      }
    }
  }

  createSubscription(data: Partial<SubscriptionModel>): void {
    this.subscriptionService.createSubscription(data).subscribe({
      next: (newSubscription) => {
        const subscription = createSubscription(newSubscription as any);
        this.subscriptions.update(subs => [...subs, subscription]);
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating subscription:', error);
      }
    });
  }

  updateSubscription(id: number, data: Partial<SubscriptionModel>): void {
    this.subscriptionService.updateSubscription(id, data).subscribe({
      next: (updatedSubscription) => {
        const subscription = createSubscription(updatedSubscription as any);
        this.subscriptions.update(subs =>
          subs.map(s => s.id === id ? subscription : s)
        );
        this.closeModal();
      },
      error: (error) => {
        console.error('Error updating subscription:', error);
      }
    });
  }

  deleteSubscription(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta suscripción?')) {
      this.subscriptionService.deleteSubscription(id).subscribe({
        next: () => {
          this.subscriptions.update(subs => subs.filter(s => s.id !== id));
        },
        error: (error) => {
          console.error('Error deleting subscription:', error);
        }
      });
    }
  }

  getSelectedDays(subscription: SubscriptionModel): string {
    if (subscription.days.length === 0) return 'Ningún día';
    if (subscription.days.length === 7) return 'Todos los días';
    return subscription.days.join(', ');
  }

  getDayDisplayName(day: WeekDay): string {
    const dayNames = {
      [WeekDay.MONDAY]: 'Lunes',
      [WeekDay.TUESDAY]: 'Martes',
      [WeekDay.WEDNESDAY]: 'Miércoles',
      [WeekDay.THURSDAY]: 'Jueves',
      [WeekDay.FRIDAY]: 'Viernes',
      [WeekDay.SATURDAY]: 'Sábado',
      [WeekDay.SUNDAY]: 'Domingo'
    };
    return dayNames[day];
  }

  getWeekDays(): WeekDay[] {
    return Object.values(WeekDay);
  }

  trackByFn(index: number, item: SubscriptionModel): number {
    return item.id;
  }
}
