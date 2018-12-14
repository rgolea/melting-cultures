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
import { FormlyModule } from '@ngx-formly/core';
import { FormlyIonicModule } from '@ngx-formly/ionic';
import { SharedModule } from '@meco/shared';
import { LoginComponent } from './login/login.component';

const routes: Route[] = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'channels', component: ChannelsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  entryComponents: [ChannelComponent],
  declarations: [
    AppComponent,
    RegisterComponent,
    ChannelsComponent,
    ChannelComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    NxModule.forRoot(),
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
    IonicModule.forRoot(),
    LeafletModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'required', message: 'The field is required' },
        {
          name: 'maxLength',
          message: 'The field has more characters than it should'
        }
      ]
    }),
    FormlyIonicModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
