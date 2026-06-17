import { PublicLayout } from "@/components/layout/PublicLayout";

export function Legal() {
  return (
    <PublicLayout>
      <div className="container max-w-3xl py-12">
        <h1 className="text-3xl font-bold mb-6">Mentions légales</h1>
        <div className="prose prose-blue">
          <p>En vigueur au 01/01/2024</p>
          <p>Conformément aux dispositions des Articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l'économie numérique, dite L.C.E.N., il est porté à la connaissance des utilisateurs et visiteurs du site LocalMarket les présentes mentions légales.</p>
          <h3>Éditeur du site</h3>
          <p>Le site LocalMarket est édité par l'association LocalMarket, domiciliée au 1 rue de la Mairie, 75000 Paris.</p>
          <h3>Hébergement</h3>
          <p>Le site est hébergé par Replit.</p>
        </div>
      </div>
    </PublicLayout>
  );
}

export function CGU() {
  return (
    <PublicLayout>
      <div className="container max-w-3xl py-12">
        <h1 className="text-3xl font-bold mb-6">Conditions Générales d'Utilisation</h1>
        <div className="prose prose-blue">
          <p>Les présentes CGU ont pour objet l'encadrement juridique des modalités de mise à disposition du site et des services par LocalMarket et de définir les conditions d'accès et d'utilisation des services par "l'Utilisateur".</p>
          <h3>Accès au site</h3>
          <p>Le site est accessible gratuitement en tout lieu à tout Utilisateur ayant un accès à Internet. Tous les frais supportés par l'Utilisateur pour accéder au service (matériel informatique, logiciels, connexion Internet, etc.) sont à sa charge.</p>
          <h3>Responsabilité</h3>
          <p>Les sources des informations diffusées sur le site sont réputées fiables mais le site ne garantit pas qu'il soit exempt de défauts, d'erreurs ou d'omissions.</p>
        </div>
      </div>
    </PublicLayout>
  );
}

export function Privacy() {
  return (
    <PublicLayout>
      <div className="container max-w-3xl py-12">
        <h1 className="text-3xl font-bold mb-6">Politique de confidentialité</h1>
        <div className="prose prose-blue">
          <p>La protection de vos données personnelles est une priorité pour LocalMarket.</p>
          <h3>Collecte des données</h3>
          <p>Nous collectons les données suivantes lors du dépôt d'une annonce : nom, email, téléphone, localisation.</p>
          <h3>Utilisation des données</h3>
          <p>Ces données sont utilisées uniquement dans le cadre de la mise en relation entre utilisateurs pour les échanges locaux.</p>
          <h3>Vos droits</h3>
          <p>Conformément à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.</p>
        </div>
      </div>
    </PublicLayout>
  );
}
