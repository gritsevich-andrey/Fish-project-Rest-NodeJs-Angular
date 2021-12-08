import {Component, Input, OnInit} from '@angular/core';
import {Travel} from "../../../shared/interfaces";

@Component({
    selector: 'app-travel-item',
    templateUrl: './travel-item.component.html',
    styleUrls: ['./travel-item.component.scss']
})
export class TravelItemComponent implements OnInit {
    @Input() travel!: Travel;
    @Input() openUserProfile!: any;
    @Input() userEmail!: string;
    @Input() setTravelPublic!: any;
    @Input() openEditTravel!: any;
    @Input() getUserTravels!: any;

    constructor() {
    }

    ngOnInit(): void {
    }

}
