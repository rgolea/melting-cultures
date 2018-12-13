import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NxModule } from '@nrwl/nx';
import { RouterModule, Route } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RegisterComponent } from './register/register.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChannelsComponent } from './channels/channels.component';
import { ChannelComponent } from './channel/channel.component';


const routes: Route[] = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'languages', component: ChannelsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  entryComponents: [
    ChannelComponent
  ],
  declarations: [AppComponent, RegisterComponent, ChannelsComponent, ChannelComponent],
  imports: [
    BrowserModule,
    NxModule.forRoot(),
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
    IonicModule.forRoot(),
    LeafletModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
