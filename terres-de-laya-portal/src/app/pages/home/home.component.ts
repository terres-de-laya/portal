import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
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
    { title: 'Qu\'est-ce que Element ?', videoUrl: 'url_to_your_video.mp4' },
    { title: 'Installer Element sur mon téléphone', videoUrl: 'url_to_your_video.mp4' },
    { title: 'Naviguer dans l\'interface Element', videoUrl: 'url_to_your_video.mp4' },
    { title: 'Participer aux discussions dans les salons', videoUrl: 'url_to_your_video.mp4' },
    { title: 'Créer et organiser des salons pour l\'écoquartier', videoUrl: 'url_to_your_video.mp4' },
    { title: 'Configurer les notifications intelligemment', videoUrl: 'url_to_your_video.mp4' },
    { title: 'Créer et répondre à un sondage', videoUrl: 'url_to_your_video.mp4' },
    { title: 'Collaborer avec des fichiers et documents', videoUrl: 'url_to_your_video.mp4' },
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

  constructor() {
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
}
