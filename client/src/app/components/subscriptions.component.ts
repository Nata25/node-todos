import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-on-destroy',
  template: '',
})
export abstract class SubscriptionsComponent implements OnDestroy {
  subscriptions: { [key: string]: Subscription } = {};

  ngOnDestroy(): void {
    Object.keys(this.subscriptions).forEach(key => {
      this.subscriptions[key].unsubscribe();
    });
  }
}
