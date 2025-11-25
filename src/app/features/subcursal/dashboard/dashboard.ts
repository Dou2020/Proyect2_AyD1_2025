import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../utils/alert-modal/alert.service';
import { sucursalService } from '../../../core/services/sucursal/sucursal.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit{

  originalData: any = null;
  currentData: any = null;
  sucursalId = 0;

  private refreshSub!: Subscription;

  constructor(
    private sucursalService: sucursalService
  ){}

  ngOnInit(): void {
    this.loadInitialData();
    this.setupAutoRefresh();
  }

  loadInitialData() {
    this.sucursalService.getProfile().subscribe(data => {
      this.originalData = data;
      this.sucursalId = this.originalData.id;
      this.loadLiveData();
    });
  }

  loadLiveData() {
    this.sucursalService.getLiveProfile(this.sucursalId).subscribe(data => {
      this.currentData = data;
    });
  }

  setupAutoRefresh() {
    this.refreshSub = interval(30000).subscribe(() => {
      this.loadLiveData();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSub) this.refreshSub.unsubscribe();
  }

}
