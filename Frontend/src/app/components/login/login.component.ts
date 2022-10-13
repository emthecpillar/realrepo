import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { StorageService } from 'src/app/services/storage.service';
import { AppState } from 'src/app/store/app.state';
import {
	setUserId,
	toggleAuth,
	toggleLoading,
} from 'src/app/store/shared/actions/shared.actions';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	form: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private storageService: StorageService,
		private router: Router,
		private profileService: ProfileService,
		private store: Store<AppState>
	) {
		this.form = this.formBuilder.group({
			email: ['', Validators.required],
			password: ['', Validators.required],
		});
	}

	//Make login post request, save token response to session storage, navigate to home
	login() {
		const val = this.form.value;

		if (val.email && val.password) {
			this.store.dispatch(toggleLoading({ status: true }));

			this.authService
				.login(val.email.toLowerCase(), val.password)
				.subscribe((res) => {
					this.storageService.saveUser(res.username);
					this.storageService.saveToken(res.token);

					this.profileService.getProfile().subscribe((res) => {
						this.profileService.setProfile(res);
						this.store.dispatch(toggleAuth({ status: true }));
						this.store.dispatch(
							setUserId({
								userId: JSON.parse(
									localStorage.getItem('user') || ''
								).userId,
							})
						);
						this.store.dispatch(toggleLoading({ status: false }));

						this.router.navigateByUrl('/explore');
					});
				});
		}
	}

	//If already logged in and user profile found, navigate to home
	ngOnInit(): void {
		if (this.storageService.getToken()) {
			this.router.navigateByUrl('/explore');
		}
	}
}
