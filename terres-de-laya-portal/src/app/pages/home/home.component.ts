import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { TuiCarousel, TuiPagination } from '@taiga-ui/kit';
import { CeilPipe } from '../../shared/pipes/ceil.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TuiButton, TuiPagination, RouterLink, TuiButton, TuiCarousel, CommonModule, CeilPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  protected index = 0;
  protected currentPage = 0;
  protected itemsPerPage = 3;

  protected readonly items = [
    { title: 'Creer un compte sur terresdelaya.fr', videoUrl: 'https://www.youtube.com/embed/twLqvKJ1vB8' },
    { title: 'Presentation de Element', videoUrl: 'https://www.youtube.com/embed/OAiILPEcwbQ' },
    { title: 'Installer Element sur mon téléphone', videoUrl: 'https://www.youtube.com/embed/3C0Oh7G2WJA' },
  ];

  protected get rounded(): number {
    return Math.floor(this.index / this.itemsPerPage);
  }

  protected onIndex(index: number): void {
    this.index = index * this.itemsPerPage;
  }

  protected onPageChange(page: number): void {
    this.currentPage = page;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.setItemsPerPage();
  }

  constructor(private sanitizer: DomSanitizer) {
    this.setItemsPerPage();
  }

  private setItemsPerPage() {
    if (window.innerWidth < 767) {
      this.itemsPerPage = 1; // adjust this value as needed
    } else if (window.innerWidth < 1024) {
      this.itemsPerPage = 2; // adjust this value as needed
    } else {
      this.itemsPerPage = 3; // default value
    }
  }

  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
