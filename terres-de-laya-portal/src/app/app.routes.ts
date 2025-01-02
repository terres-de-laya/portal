import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { FaqComponent } from './pages/faq/faq.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
            },
            {
                path: 'faq',
                component: FaqComponent,
            },
        ],
    }
];