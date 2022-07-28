import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectAppVersion } from 'src/app/store/app.selectors';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
})
export class AboutPageComponent implements OnInit {

  public appVersion$: Observable<string> = this.store.select(selectAppVersion);

  constructor(private store: Store) { }

  ngOnInit() {}

}
