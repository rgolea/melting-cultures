import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('audio') audioElement: ElementRef<HTMLAudioElement>;

  ngOnInit(){
    console.log(this.audioElement.nativeElement);
  }
}
