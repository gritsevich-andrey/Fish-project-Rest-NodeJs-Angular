import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebsocketService} from "../../shared/services/websocket.service";
import {ChatMessageDto} from "../../shared/models/chatMessageDto";
import {FormArray, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";
import {mimeType} from "../cabinet/mime-type.validator";

@Component({
  selector: 'app-live-feed',
  templateUrl: './live-feed.component.html',
  styleUrls: ['./live-feed.component.scss']
})
export class LiveFeedComponent implements OnInit, OnDestroy {
  userEmail!: string;
  file!: File;
  form!: FormGroup;
  imagePreview = 'uploads/file.jpg';

  constructor(public webSocketService: WebsocketService,
              private userService: UserService) {
    this.form = new FormGroup({
      description:  new FormControl(''),
      file: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.webSocketService.openWebSocket();
    this.userEmail = this.userService.getUserDataFromLocal();
    console.log(this.userEmail);
  }

  sendMessage() {
    const chatMessageDto = new ChatMessageDto(this.userEmail, this.form.value.description, this.form.value.file);
    this.webSocketService.sendMessage(chatMessageDto);
    this.form.controls.description.reset();
    this.form.controls.file.reset();
  }

  onImageLoad(event: Event) {
    // @ts-ignore
    const file = (event.target as HTMLInputElement).files[0];
    this.file = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.form.patchValue({file: reader.result});
    }
    reader.readAsDataURL(file);
  }

  ngOnDestroy(): void {
    this.webSocketService.closeWebSocket();
  }
}
