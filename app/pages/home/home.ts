import { Page } from 'ionic-angular';
import { SolarSystemComponent } from '../../components/solarsystem/solarsystem';

@Page({
  templateUrl: 'build/pages/home/home.html',
  directives: [SolarSystemComponent]
})

export class HomePage {
  constructor() {

  }
}
