import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { childRoutes } from 'src/app/layout/child-routes';
import { MaterialModule } from 'src/app/material/material.module';


@Component({
  selector: 'app-side-nav-closed',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './side-nav-closed.component.html',
  styleUrl: './side-nav-closed.component.css'
})
export class SideNavClosedComponent implements OnInit {
    routes = childRoutes;
    constructor() { }

    ngOnInit(): void {
    }
}
