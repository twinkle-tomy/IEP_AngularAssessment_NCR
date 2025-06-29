import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OTRComponent } from './home/otr/otr.component';
import { authentifyGuard } from './Guard/authentify.guard';
import { NcrComponent } from './Modules/Quality/ncr/ncr.component';
import { IspoComponent } from './Modules/Operation/ispo/ispo.component';

export const routes: Routes = 
[
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'otr',
        component:OTRComponent,
        title :'OTR',
        canActivate : [authentifyGuard]
    },
    {
        path:'ncr',
        component:NcrComponent,
        title :'NCR',
        canActivate : [authentifyGuard]
    },
    {
        path:'ispo',
        component:IspoComponent,
        title :'ISPO',
        canActivate : [authentifyGuard]
    }
];
