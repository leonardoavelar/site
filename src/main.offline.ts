import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [
    ...appConfig.providers,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
}).catch((err) => console.error(err));
