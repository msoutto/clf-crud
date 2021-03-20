import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { UtilService } from 'src/app/helper/util';
import { Clf } from 'src/app/model/clf.model';
import { ClfService } from 'src/app/service/clf.service';

@Component({
  selector: 'app-clf-form-dialog',
  templateUrl: './clf-form-dialog.component.html',
  styleUrls: ['./clf-form-dialog.component.css']
})
export class ClfFormDialogComponent implements OnInit {
  type: string;

  clf: Clf = new Clf();

  clfForm: FormGroup;

  method: string = 'GET';

  methodOptions: string[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS',
    'HEAD', 'CONNECT', 'TRACE'];

  requestDate: moment.Moment = moment();
  time: string;
  timeZone: string = '+00:00';

  timeZoneList: string[] = ['-12:00', '-11:00', '-10:00', '-09:00', '-08:00', '-07:00', '-06:00', '-05:00',
    '-04:00', '-03:00', '-02:00', '-01:00', '+00:00', '+01:00', '+02:00', '+03:00',
    '+04:00', '+05:00', '+06:00', '+07:00', '+08:00', '+09:00', '+10:00', '+11:00', '+12:00'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Clf,
    private formBuilder: FormBuilder,
    private clfService: ClfService,
    private utilService: UtilService,
    public dialogRef: MatDialogRef<ClfFormDialogComponent>
  ) { }

  ngOnInit() {

    if (this.data && this.data.id) {
      this.type = 'update';

      this.clf = this.data;

      this.requestDate = moment(this.data.requestDate);

      let time = this.requestDate.format('HH:mm:ss');
      let timeZone = this.requestDate.format('Z');
      console.log(time);
      console.log(timeZone);
      this.clfForm = this.formBuilder.group({
        client: [this.data.client, Validators.required],
        rfcIdentity: [this.data.rfcIdentity, Validators.required],
        userId: [this.data.userId, Validators.required],
        requestDate: [this.data.requestDate, Validators.required],
        time: [time, Validators.required],
        timeZone: [timeZone, Validators.required],
        method: [this.data.method, Validators.required],
        request: [this.data.request, Validators.required],
        protocol: [this.data.protocol, Validators.required],
        statusCode: [this.data.statusCode, Validators.required],
        responseSize: [this.data.responseSize, Validators.required],
        referrer: [this.data.referrer, Validators.required],
        userAgent: [this.data.userAgent, Validators.required]
      });
    } else {
      this.type = 'create';

      this.clfForm = this.formBuilder.group({
        client: [null, Validators.required],
        rfcIdentity: [null, Validators.required],
        userId: [null, Validators.required],
        requestDate: [null, Validators.required],
        time: [null, Validators.required],
        timeZone: [null, Validators.required],
        method: [null, Validators.required],
        request: [null, Validators.required],
        protocol: [null, Validators.required],
        statusCode: [null, Validators.required],
        responseSize: [null, Validators.required],
        referrer: [null, Validators.required],
        userAgent: [null, Validators.required]
      });
    }

    console.log(this.data);
  }

  createClf(): void {
    this.prepare();

    this.clfService.postClf(this.utilService.getJsonFromClf(this.clf)).subscribe(result => { });
    this.dialogRef.close();
    this.clfForm.reset();
  }

  updateClf(): void {
    this.prepare();

    this.clfService.putClf(this.clf.id, this.utilService.getJsonFromClf(this.clf)).subscribe(result => { });
    this.dialogRef.close();
    this.clfForm.reset();
  }

  prepare(): void {
    this.requestDate = moment(this.clfForm.controls.requestDate.value);
    
    console.log(this.requestDate);
    this.requestDate.set({
      hour: Number(this.clfForm.controls.time.value.substr(0, 2)),
      minute: Number(this.clfForm.controls.time.value.substr(3, 2)),
      second: Number(this.clfForm.controls.time.value.substr(6, 2))
    })

    // utcOffset() only sets the UTC flag, not actually change the date
    this.requestDate = moment(
      this.requestDate.utcOffset(this.clfForm.controls.timeZone.value, true).format()
    );
    console.log(this.requestDate);

    this.clf = {
      id: this.clf.id,
      client: this.clfForm.controls.client.value,
      rfcIdentity: this.clfForm.controls.rfcIdentity.value,
      userId: this.clfForm.controls.userId.value,
      requestDate: this.requestDate,
      method: this.clfForm.controls.method.value,
      request: this.clfForm.controls.request.value,
      protocol: this.clfForm.controls.protocol.value,
      statusCode: Number(this.clfForm.controls.statusCode.value),
      responseSize: Number(this.clfForm.controls.responseSize.value),
      referrer: this.clfForm.controls.referrer.value,
      userAgent: this.clfForm.controls.userAgent.value
    }
  }

  cancel(): void {
    this.dialogRef.close();
    this.clfForm.reset();
  }

}
