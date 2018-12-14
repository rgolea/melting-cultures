import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
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
    private readonly modalController: ModalController,
    private readonly alertController: AlertController
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

  async delete(channel){
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to delete this channel?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Okay',
          role: 'ok',
          cssClass: 'primary',
          handler: () => {
            const i = this.channels.indexOf(channel);
            if(i > -1){
              this.channels.splice(i, 1);
              this.channels$.next(this.channels);
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
