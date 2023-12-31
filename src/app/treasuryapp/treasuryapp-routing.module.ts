
import { SegmentsResolver } from './../shared/resolvers/segments.resolver';
import { ProductsResolver } from './../shared/resolvers/products.resolver';
import { CurrenciesResolver } from './../shared/resolvers/currencies.resolver';
import { WalletsizingComponent } from './walletsizing/walletsizing.component';
import { FxflowsComponent } from './fxflows/fxflows.component';
import { FxblotterComponent } from './fxblotter/fxblotter.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashComponent } from '../layout/dash/dash.component';
import { PageNotFoundComponent } from '../shared/page-not-found/page-not-found.component';
import { DealersResolver } from '../shared/resolvers/dealers.resolver';
import { CustomerResolver } from '../shared/resolvers/customers.resolver';
import { SettingsComponent } from './config/settings/settings.component';
import { TradesflowComponent } from './tradesflow/tradesflow.component';
import { TradesResolver } from '../shared/resolvers/trades.resolver';

const routes: Routes = [

  { path: '', component: DashComponent ,
  children: [
     { path: 'fxflows', component: FxflowsComponent },
     { path: 'tradesflow',
     component: TradesflowComponent,
     resolve: {
      currencies: CurrenciesResolver,
      products: ProductsResolver,
      segments: SegmentsResolver,
      traders: DealersResolver,
      customers: CustomerResolver,
      trades: TradesResolver
    }
  },
     { path: 'fxblotter',
     component: FxblotterComponent,
     resolve: {
      currencies: CurrenciesResolver,
      products: ProductsResolver,
      segments: SegmentsResolver,
      traders: DealersResolver,
      customers: CustomerResolver
    }
  },
     { path: 'walletsizing', component: WalletsizingComponent },
     { path: 'settings', component: SettingsComponent },
     {path: 'not-found', component: PageNotFoundComponent}
  ]
},
{
  path: '',
  redirectTo: '/',
  pathMatch: 'full'
},
{
  path: '**',
  redirectTo: '/not-found',
  pathMatch: 'full'
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    CurrenciesResolver,
    ProductsResolver,
    CustomerResolver,
    SegmentsResolver,
    DealersResolver,
    DealersResolver,
    TradesResolver

  ]
})
export class TreasuryappRoutingModule { }
