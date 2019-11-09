import { Component, OnInit } from '@angular/core';
import { NguCarouselConfig } from '@ngu/carousel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  burger = false;

  imgags = [
    {
      site: 'Motor 1',
      title: 'Les radars automatiques vont devenir intelligents',
      img: 'assets/motor1.png',
      URL: 'https://fr.motor1.com/news/379069/radars-automatiques-intelligence-artificielle/',
      date: '2019-11-03',
      citation: "Grâce à cette API, les automobilistes victimes d'une fausse doublette ne devraient plus recevoir de contravention dans leur boîte aux lettres",
      author: 'Khalil Bouguerra'
    },
    {
      site: 'Actu IA',
      title: "Testez l’API d’IA Flash, le projet IA développé pour fiabiliser la constatation des contraventions à partir de la reconnaissance d’images",
      img: 'assets/actu-ia.png',
      URL: 'https://www.actuia.com/actualite/testez-lapi-dia-flash-le-projet-ia-developpe-pour-fiabiliser-la-constatation-des-contraventions-a-partir-de-la-reconnaissance-dimages/',
      date: '2019-10-31',
      citation: "La brique logicielle de reconnaissance d’image créée viendra compléter la panoplie des outils numériques de pointe de l’ANTAI",
      author: 'Thierry Maubant'
    },
    {
      site: 'Le Point',
      title: "Quand l'intelligence artificielle vient en aide aux radars",
      img: 'assets/lepoint.svg',
      URL: 'https://www.lepoint.fr/societe/quand-l-intelligence-artificielle-vient-en-aide-aux-radars-30-10-2019-2344210_23.php',
      date: '2019-10-30',
      citation: "IA Flash pourrait faire gagner beaucoup de temps aux uns et éviter une mauvaise surprise aux autres.",
      author: 'LePoint.fr'
    },
    {
      site: 'Capital',
      title: "L'intelligence artificielle au secours des radars automatiques pour éviter les erreurs",
      img: 'assets/capital.svg',
      URL: 'https://www.capital.fr/economie-politique/lintelligence-artificielle-au-secours-des-radars-automatiques-pour-eviter-les-erreurs-1353915',
      date: '2019-10-29',
      citation: "..pour éviter que ce soit à l'automobiliste injustement verbalisé de justifier l'erreur, 'IA Flash' pourrait utiliser l'intelligence artificielle pour empêcher ce type d'erreurs",
      author: 'Sarah Ugolini'
    },
    {
      site: 'Le Big Data',
      title: "Les radars automatiques français passent à l'intelligence artificielle",
      img: 'assets/lebigdata.png',
      URL: 'https://www.lebigdata.fr/radars-automatiques-intelligence-artificielle/amp/',
      date: '2019-10-29',
      citation: "L’erreur détectée par l’IA donnera lieu à une enquête des services de l’Etat pour retrouver le vrai chauffard, et l’automobiliste n’aura donc pas à justifier lui-même",
      author: 'Bastien L'
    },
    {
      site: 'BFMTV',
      title: "Sécurité routière: les radars bientôt aidés par l'intelligence artificielle",
      img: 'assets/bfmtv.svg',
      URL: 'https://auto.bfmtv.com/actualite/securite-routiere-les-radars-bientot-aides-par-l-intelligence-artificielle-1795251.html',
      date: '2019-10-28',
      citation: "S'il est forcément moins performant sur des modèles atypiques ou trop récents, ce logiciel fait tout de même preuve d'une redoutable efficacité",
      author: 'BFMTV'
    },
    {
      site: 'Radar Auto',
      title: "Quand l'intelligence artificielle est utilisée pour mieux verbaliser",
      img: 'assets/radar-auto.jpg',
      URL: 'https://www.radars-auto.com/actualite/actu-radars-general/quand-l-intelligence-artificielle-est-utilisee-pour-mieux-verbaliser-1598',
      date: '2019-10-22',
      citation: "Les données particulièrement riches des millions de photos enregistrées chaque année par les radars automatiques garantissent la fiabilité du résultat.",
      author: 'Nicolas'
    },
  ];

  public carouselTile: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 3, lg: 3, all: 0 },
    slide: 3,
    speed: 250,
    point: {
      visible: true
    },
    load: 2,
    velocity: 0,
    touch: false,
    loop: true,
    interval: {
        timing: 3000,
        initialDelay: 1000
     },
    easing: 'cubic-bezier(0, 0, 0.2, 1)'
  };

  constructor() { }

  ngOnInit() {
  }

  toggleBurger() {
    this.burger = !this.burger;
  }

}
