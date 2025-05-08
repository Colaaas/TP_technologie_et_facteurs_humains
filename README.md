Pong EMG + EDA 

            Etapes pour préparer et faire fonctionner adéquatement le projet

Ce projet consiste en un jeu interactif de Pong où les raquettes sont contrôlées par les signaux bioélectriques de l'utilisateur, à savoir les signaux EMG (activité musculaire) et EDA (réponse électrodermale). Ce jeu est alimenté par des données capturées par un dispositif BITalino.
Fonctionnement du projet

    EMG (Electromyography) : La raquette est contrôlée par les contractions musculaires de l'utilisateur. Plus la contraction est forte, plus la raquette se déplace.
    EDA (Electrodermal Activity) : Le stress de l'utilisateur est mesuré via l'EDA. Lorsque le stress augmente, la vitesse de la balle change (accélère ou ralentit).

Prérequis

Avant de pouvoir exécuter ce projet, assurez-vous d'avoir les éléments suivants installés et configurés :
1. Hardware

    BITalino (ou tout autre dispositif similaire) : Un capteur permettant de capturer les signaux EMG et EDA.

    Connexion Bluetooth : Le dispositif BITalino doit être connecté à votre machine via Bluetooth.

2. Logiciel :

    Python : Ce projet utilise Python pour l'exécution du jeu.
    Bibliothèques Python nécessaires :

        pygame : Pour le rendu graphique du jeu.

        numpy : Pour le traitement des signaux.

        matplotlib : Pour afficher les courbes des signaux EMG et EDA en temps réel.

        bitalino : Pour communiquer avec le capteur BITalino et lire les signaux.

        tkinter : Pour l'interface de simulation de stress (facultatif si vous ne souhaitez pas utiliser cette fonctionnalité).

3. Installation des bibliothèques

Avant de démarrer, vous devez installer toutes les bibliothèques Python nécessaires. Utilisez la commande suivante pour installer les dépendances :

pip install pygame numpy matplotlib bitalino tkinter

Préparation du projet
1. Configuration du capteur BITalino

    Téléchargez le logiciel BITalino à partir de leur site officiel.

    Connectez le dispositif BITalino à votre PC via Bluetooth et assurez-vous qu'il fonctionne correctement. Assurez-vous que le port du capteur est correct (par défaut : canal 0 pour EMG, canal 1 pour EDA).

2. Configuration des canaux de lecture

Le projet lit les données des canaux suivants :

    Canal 0(Entrée 1) pour le signal EMG (activité musculaire).

    Canal 1(Entrée 2) pour le signal EDA (réponse électrodermale).

    3. Lancer le projet

Une fois que tout est configuré, exécutez simplement le script Python pour démarrer le jeu.

Cela démarrera le jeu où vous contrôlerez la raquette avec vos muscles et où le niveau de stress (via l'EDA) influencera la vitesse de la balle. Les signaux EMG et EDA seront affichés en temps réel dans une interface graphique grâce à matplotlib.
