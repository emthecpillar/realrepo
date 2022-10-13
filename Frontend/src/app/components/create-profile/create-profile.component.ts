import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserProfile } from 'src/app/types/user';

@Component({
	selector: 'app-create-profile',
	templateUrl: './create-profile.component.html',
	styleUrls: ['./create-profile.component.scss'],
})
export class CreateProfileComponent implements OnInit {
	form: FormGroup;
	user: UserProfile;

	constructor(
		private formBuilder: FormBuilder,
		private profileService: ProfileService,
		private router: Router,
		private storageService: StorageService
	) {
		this.form = this.formBuilder.group({
			age: ['', Validators.required],
			weight: ['', Validators.required],
			country: ['', Validators.required],
			avatar: ['', Validators.required],
			funFact: ['', Validators.required],
			covidVaccine: [false, Validators.required],
			smoker: [false, Validators.required],
			drinker: [false, Validators.required],
			optOut: [false, Validators.required],
		});
		this.user = {
			userId: 0,
			username: "",
			age: 0,
			weight: 0,
			country: '',
			avatar: '',
			status: '',
			reputation: 0,
			funFact: '',
			covidVaccine: false,
			smoker: false,
			drinker: false,
			twoFactor: false,
			optOutOfPublicStories: false,
			cameraPermission: false,
			microphonePermission: false,
			notificationPermission: false,
			filePermission: false,
			nightMode: false,
			highContrast: false,
			slowInternet: false,
			textSize: 16,
			screenReader: false,
		};
	}

	//Redirect to splash screen if not logged in
	ngOnInit(): void {
		if (!this.storageService.getToken()) {
			this.router.navigateByUrl("splash");
		}
	}

	//Create new user_profile entry in database using fields from form and redirect to home page
	submitProfile() {
		let val = this.form.value;
		let username = this.storageService.getUser();

		if (username !== null) {
			this.user.username = username		
			this.user.age = parseInt(val.age);
			this.user.weight = parseInt(val.weight);
			this.user.country = val.country;
			this.user.avatar = val.avatar;
			this.user.status = val.status;
			this.user.funFact = val.funFact;
			this.user.covidVaccine = val.covidVaccine;
			this.user.smoker = val.smoker;
			this.user.drinker = val.drinker;
			this.user.optOutOfPublicStories = val.optOut;

			this.profileService.createProfile(this.user).subscribe((res) => {
				this.profileService.setProfile(res);
				this.router.navigateByUrl("/home");
			});
		}
	}
}
