import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './lib/app.config';
import { AppComponent } from './lib/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
