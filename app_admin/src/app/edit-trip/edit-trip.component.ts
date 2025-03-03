import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trips';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.component.html',
  styleUrls: ['./edit-trip.component.css']
})
export class EditTripComponent implements OnInit {
  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message: string = '';
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private tripService: TripDataService
  ) {}

  ngOnInit(): void {
    let tripCode = localStorage.getItem("tripCode");
    if (!tripCode) {
      alert("Something wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }

    console.log('EditTripComponent::ngOnInit');
    console.log('tripcode:' + tripCode);

    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode], // Pre-set code
      name: [''],
      length: [''],
      start: [''],
      resort: [''],
      perPerson: [''],
      image: [''],
      description: ['']
    });

    this.tripService.getTrip(tripCode)
      .subscribe({
        next: (value: any) => {
          this.trip = value[0];
          this.editForm.patchValue(value[0]);
          this.message = value[0] ? `Trip: ${tripCode} retrieved` : 'No Trip Retrieved!';
          console.log(this.message);
        },
        error: (error: any) => {
          console.log('Error fetching trip:', error);
        }
      });
  }

  public onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    console.log('EditTrip Form submitted:', this.editForm.value);
    if (this.editForm.dirty) {
      const updatedTrip = { ...this.trip, ...this.editForm.value };
      console.log('Sending updated trip:', updatedTrip);
      this.tripService.updateTrip(updatedTrip)
        .subscribe({
          next: (value: any) => {
            console.log('Trip updated successfully:', value);
            this.router.navigate(['/list-trips']);
          },
          error: (error: any) => {
            console.error('Error updating trip:', error);
            this.errorMessage = error.status === 401 ? 'Unauthorized: Please log in again.' : (error.message || 'Failed to update trip.');
          }
        });
    } else {
      console.log('No changes to submit');
      this.router.navigate(['/list-trips']);
    }
  }

  get f() { return this.editForm.controls; }
}