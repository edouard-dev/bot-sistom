const puppeteer = require('puppeteer');
const { log } = require('./log');

const connexion = async (page, user, pass) => {
    await page.waitForSelector('input[name="email"]', { visible: true });
    const input = await page.$('input[name="email"]');
    await input.focus(); // Focalise sur l'input
    await page.type('input[name="email"]', user, { delay: 100 }); // Simule une saisie humaine
    await page.waitForSelector('input[name="password"]', { visible: true });
    const password = await page.$('input[name="password"]');
    await password.focus(); // Focalise sur l'input
    await page.type('input[name="password"]', pass, { delay: 100 }); // Simule une saisie humaine
    await page.waitForSelector('a.btnConnexion'); // Attendre que l'élément soit chargé
    await page.click('a.btnConnexion'); // Cliquer sur le bouton
    log('Connexion réussi');
}

module.exports = { connexion };