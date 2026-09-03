import { Component, input } from '@angular/core';
import { Profile } from '../../../model/profile';

@Component({
  selector: 'app-profile-view',
  imports: [],
  templateUrl: './profile-view.html',
  styleUrl: './profile-view.css',
})
export class ProfileView {
  profile = input<Profile | null>()
}
