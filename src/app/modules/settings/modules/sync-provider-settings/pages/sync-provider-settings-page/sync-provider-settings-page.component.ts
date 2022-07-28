import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sync-provider-settings-page',
  templateUrl: './sync-provider-settings-page.component.html',
  styleUrls: ['./sync-provider-settings-page.component.scss'],
})
export class SyncProviderSettingsPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  onBack() {
    this.router.navigate(['/settings']);
  }

}
