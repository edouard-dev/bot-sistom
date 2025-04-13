const puppeteer = require('puppeteer');
const { connexion } = require('./modules/connexion');
const { list_offre } = require('./modules/list_offre');

const http = require('http');
const express = require('express');
const path = require('path');
const { log, initLogs } = require('./modules/log');

// Crée une instance d'Express
const app = express();

// Crée une instance de serveur HTTP avec Express
const server = http.createServer(app);

// Initialiser les logs avec Socket.IO
initLogs(server);

// Servir le fichier logs.html sur http://localhost:3001
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'logs.html'));
});

// Lancement du serveur
server.listen(3001, () => console.log('Serveur WebSocket et fichier HTML disponibles sur http://localhost:3001'));

// Script principal avec Puppeteer
const start = async (user, mdp) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    log('Ouverture de la page de connexion...');
    await page.goto('https://visualqie.com/login.php', { waitUntil: 'domcontentloaded' });

    log('Connexion en cours...');
    await connexion(page, user, mdp);
    await list_offre(user, page)
    log(`Script terminé pour ${user}.`);
  } catch (err) {
    log(`Une erreur s'est produite : ${err.message}`);
  }
};

app.post('/start-script', async (req, res) => {
  log('Démarrage du script');
  log('Lancement pour Thomas ...');
  start('T.HAMON', 'aeDEj429');
  log('Lancement pour Oscar ...');
  start('O.GAL', '22GLxw2q');
  res.json({ status: 'Script lancé' });
});
