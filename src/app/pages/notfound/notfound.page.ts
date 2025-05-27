import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.page.html',
  styleUrls: ['./notfound.page.scss'],
  standalone: false
})
export class NotfoundPage implements OnInit {

  constructor(private router: Router) { }

  IraInicio(){
    this.router.navigate(['/inicio'])
  }

  ngOnInit() {
  }

}
