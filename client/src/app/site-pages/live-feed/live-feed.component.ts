import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatMessageDto} from "../../shared/models/chatMessageDto";
import {FormControl, FormGroup} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";

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

  constructor(private userService: UserService) {
    this.form = new FormGroup({
      description: new FormControl(''),
      file: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.userEmail = this.userService.getUserDataFromLocal();
    console.log(this.userEmail);
  }

  sendMessage() {
    const chatMessageDto = new ChatMessageDto(this.userEmail, this.form.value.description, this.form.value.file);
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
  }
}
