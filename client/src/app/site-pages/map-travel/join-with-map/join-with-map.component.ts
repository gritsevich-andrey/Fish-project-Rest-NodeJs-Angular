import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CreateTravelModalComponent} from "../../travel/create-travel-modal/create-travel-modal.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../../shared/services/user.service";

@Component({
  selector: 'app-join-with-map',
  templateUrl: './join-with-map.component.html'
})
export class JoinWithMapComponent implements OnInit {
  private dialogRef: MatDialogRef<any> | undefined;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(data => {
      if (data.coords) {
        this.createTrip(data.coords.split(','));
      }
    });
  }

  createTrip(coords: string[]) {
    const email = this.userService.getUserDataFromLocal();
    this.dialogRef = this.dialog.open(CreateTravelModalComponent,
      {
        data: {
          latitude: coords[0],
          longitude: coords[1],
          userEmail: email
        }
      }
    );
    this.dialogRef.afterClosed()
      .subscribe((result: any) => {
        console.log('Окно закрыто', result);
        window.close();
      });
  }
}
