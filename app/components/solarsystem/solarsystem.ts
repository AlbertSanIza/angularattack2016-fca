import { Component } from "angular2/core";

@Component({
  selector: 'solar-system',
  templateUrl: 'build/components/solarsystem/solarsystem.html',
  styles: [`
    .solarsystem {
      position: absolute;
      top: -20px;
      left: 0px;
      background: black;
      width: 100%;
      height: 100%;
    }
  `]
})

export class SolarSystemComponent {
  constructor() {

  }
}
