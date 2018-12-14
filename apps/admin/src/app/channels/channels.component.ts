import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { ChannelComponent } from '../channel/channel.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'meco-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss'],
  providers: [ ModalController ]
})
export class ChannelsComponent implements OnInit {

  private channels = [];

  public channels$ = new Subject<any[]>();

  constructor(
    private readonly modalController: ModalController
  ) {}

  ngOnInit() {
  }

  async addChannel(){
    const modal = await this.modalController.create({
      component: ChannelComponent
    });

    await modal.present();

    const dismissed = await modal.onDidDismiss();
    if(dismissed.data){
      this.channels = this.channels.concat(dismissed.data);
      this.channels$.next(this.channels);
    }
  }

  stream(){
    console.log('go to streaming...');
  }

  delete(channel){
    const i = this.channels.indexOf(channel);
    if(i > -1){
      this.channels.splice(i, 1);
      this.channels$.next(this.channels);
    }
  }
}
