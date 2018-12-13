import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'meco-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChannelComponent implements OnInit {
  public fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      templateOptions: {
        type: 'text',
        placeholder: 'Channel name'
      },
      validators: [Validators.required]
    },
    {
      key: 'description',
      type: 'textarea',
      templateOptions: {
        type: 'text',
        placeholder: 'Description'
      },
      validators: [Validators.required]
    }
  ];

  public form = this.formBuilder.group({
    name: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(20)]
    ],
    description: ['', [Validators.maxLength(250)]]
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly modalController: ModalController
  ) {}

  ngOnInit() {}

  submit(){
    if(this.form.invalid) return;
    this.modalController.dismiss(this.form.value);
  }

  reset(){
    this.form.reset();
    this.modalController.dismiss();
  }
}
