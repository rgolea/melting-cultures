import { Component, OnInit, ViewChild } from '@angular/core';
import { tileLayer, MapOptions, marker, icon, LatLng } from 'leaflet';
import { Subject, Subscription } from 'rxjs';
import { LeafletDirective } from '@asymmetrik/ngx-leaflet';
import { debounceTime } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';

const { Geolocation } = Plugins;

@Component({
  selector: 'admin-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public form = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required]],
    name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(60)]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    location: this.formBuilder.group({
      lat: ['', [Validators.required]],
      lng: ['', [Validators.required]]
    })
  });

  private invalidateSize$ = new Subject();

  @ViewChild(LeafletDirective)
  private readonly leafletDirective: LeafletDirective;

  private marker = marker([39.58886, -0.33449], {
    draggable: true,
    // @ts-ignore
    autoPan: true,
    icon: icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png'
    })
  });

  public options: MapOptions = {
    zoom: 15,
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
      this.marker
    ],
    center: {
      lat: 39.58886,
      lng: -0.33449
    }
  };

  private subscriptions: Subscription[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {}

  async ngOnInit() {

      this.leafletDirective.mapReady.subscribe(async () => {
        const map = this.leafletDirective.getMap();
        try {
          const permissions = await Geolocation.requestPermissions();
          if(permissions){
            const { coords } = await Geolocation.getCurrentPosition();
            const position = new LatLng(coords.latitude, coords.longitude, coords.altitude);
            map.panTo(position);
            this.marker.setLatLng(position);
            this.stateChange();
          }
        } catch(err){
          console.error(err);
        }
      });

    this.subscriptions.push(
      this.invalidateSize$.pipe(debounceTime(100)).subscribe(async () => {
        const map =
          this.leafletDirective &&
          this.leafletDirective.getMap &&
          this.leafletDirective.getMap();
        if (map) {
          map.invalidateSize();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  stateChange() {
    this.invalidateSize$.next('stateChange');
  }

  register(){
    this.router.navigate(['/channels']);
  }
}
