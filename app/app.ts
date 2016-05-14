import { App} from 'ionic-angular';

import { HomePage } from './pages/home/home';

@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  config: {}
})

export class MyApp {
  rootPage: any = HomePage;
}
