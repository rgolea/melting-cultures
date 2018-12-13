import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChannelComponent } from '../channel/channel.component';

@Component({
  selector: 'meco-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss'],
  providers: [ ModalController ]
})
export class ChannelsComponent implements OnInit {
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
  }
}
