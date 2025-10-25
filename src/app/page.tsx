export default function Home() {
  return (
    <main style={{ padding: 24, maxWidth: 860, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 24 }}>Accueil</h1>
      <p>
        Utilisez la navigation pour gérer les Livres, Auteurs et Réservations. Le design n'a pas été
        travaillé volontairement afin de se concentrer sur les fonctionnalités principales de
        l'application.
        <br />
        <br />
        Cette application a été développée avec Next.js 13, TypeScript et utilise une API REST
        fictive pour la gestion des bouquins.
        <br />
        <br />
        Je ne me suis pas attardé sur le router post-authentification, ni sur la gestion des tokens
        (stockage, expiration, rafraîchissement, etc.) pour me concentrer sur les fonctionnalités
        principales demandées.
        <br />
        <br />
        Merci pour votre compréhension et bonne utilisation !
        <br />
        (PS: Un fichier avec les axes d'améliorations sera dans chaque répo front et back au format
        .md)
      </p>
    </main>
  );
}
