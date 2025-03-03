import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trips';

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.css']
})
export class AddTripComponent implements OnInit {
  addForm!: FormGroup;
  submitted = false;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private tripService: TripDataService
  ) {}

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      _id: [],
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  public onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    console.log('AddTrip Form submitted:', this.addForm.value);
    if (this.addForm.valid) {
      this.tripService.addTrip(this.addForm.value)
        .subscribe({
          next: (data: any) => {
            console.log('Trip added successfully:', data);
            this.router.navigate(['/list-trips']);
          },
          error: (error: any) => {
            console.error('Error adding trip:', error);
            this.errorMessage = error.status === 401 ? 'Unauthorized: Please log in again.' : (error.message || 'Failed to add trip.');
          }
        });
    } else {
      console.log('AddTrip Form invalid:', this.addForm.errors);
      this.errorMessage = 'Please fill all required fields.';
    }
  }

  get f() { return this.addForm.controls; }
}