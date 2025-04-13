const { log } = require("./log");


const switchImage = async (page) => {
  await page.click('#lnk-tabs-5');
  await page.evaluate(() => {
    // Sélectionner tous les éléments <select> dans les cellules avec la classe .photosTable2Td
    const selectElements = document.querySelectorAll('.photosTable2Td select');

    // Vérifier si les éléments existent
    if (selectElements.length >= 2) {
      // Mettre à jour la valeur du premier élément <select>
      selectElements[0].value = '2'; // Remplacez '2' par la valeur souhaitée
      const event1 = new Event('change', { bubbles: true });
      selectElements[0].dispatchEvent(event1);

      // Mettre à jour la valeur du deuxième élément <select>
      selectElements[1].value = '1'; // Remplacez '1' par la valeur souhaitée
      const event2 = new Event('change', { bubbles: true });
      selectElements[1].dispatchEvent(event2);
    }
  });
}

const modifySurface = async (page) => {
  await page.evaluate(() => {
    const input = document.getElementById('OffreSurfaceTotale');
    if (!input) return; // Vérifie que l'élément existe

    let value = parseInt(input.value, 10);
    if (isNaN(value)) return; // Évite les erreurs si la valeur n'est pas un nombre

    const newValue = value - 3;

    // Vérifie si la valeur a déjà été modifiée (évite l'ajout multiple)
    if (!input.dataset.modified) {
      input.value = newValue;
      input.dataset.modified = "true"; // Marque comme modifié
    }

    window.resultat = newValue; // Stocke la nouvelle valeur proprement
  });

  const resultat = await page.evaluate(() => window.resultat);

  if (resultat !== undefined) {
    await page.click('#OffreSurfaceTotale');

    // Efface toute la valeur (Backspace plusieurs fois)

    await page.keyboard.press('Backspace'); // Efface tout
    await page.keyboard.press('Backspace'); // Efface tout
    await page.keyboard.press('Backspace'); // Efface tout
    await page.keyboard.press('Backspace'); // Efface tout
    await page.keyboard.press('Backspace'); // Efface tout

    // Tape la nouvelle valeur correctement
    await page.type('#OffreSurfaceTotale', resultat.toString());

    // Clic en dehors pour valider
    await page.mouse.click(398, 564);
  }
};

const publish = async (page) => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await page.mouse.click(500, 282);
  await page.mouse.click(500, 310);
  await page.mouse.click(500, 282);
  await page.mouse.click(518, 307);
  await delay(1000);
  await page.mouse.click(729, 188);
}



const list_offre = async (user, page) => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {

    // Attendre un peu pour être sûr que tout est chargé
    await delay(1000); // Délai de 1 seconde

    // Attendre que l'élément du menu soit visible et cliquer dessus
    await page.waitForSelector('i.divMenuBtnIcon.fa.fa-bars', { visible: true });
    await page.click('i.divMenuBtnIcon.fa.fa-bars'); // Clique sur le menu
    await delay(1000); // Délai de 1 seconde

    // Effectuer des clics à des positions spécifiques avec la souris
    await page.mouse.click(20, 200);
    await page.mouse.click(20, 350);
    await delay(1500); // Délai de 1 seconde

    // Appliquer les filtres
    await page.waitForSelector('a#btnShowFilters', { visible: true });
    await page.click('a#btnShowFilters');
    await page.mouse.click(475, 278);
    await delay(500); // Délai de 500ms avant de vérifier la div
    if (user == 'O.GAL')
      await page.mouse.click(467, 353); // A CHANGER PAR 353 OU 373 
    else
      await page.mouse.click(467, 373); // A CHANGER PAR 353 OU 373 
    await delay(500); // Délai de 500ms avant de vérifier la div
    await page.mouse.click(158, 317);
    await delay(500); // Délai de 500ms avant de vérifier la div
    await page.mouse.click(145, 389);
    await page.select('select[name="DataTables_Table_0_length"]', '1000');
    log("Filtre appliqué");
    await delay(3000); // Délai de 5 secondes avant de vérifier la div
    await page.waitForSelector('.jqTableColAdresse');

    // Sélectionner et logger les éléments
    const selectElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('.jqTableColAdresse a');
      return Array.from(elements).map(element => element.href); // Récupérer les liens directement
    });

    log("Éléments sélectionnés :", selectElements);

    for (let i = 0; i < selectElements.length; i++) {
      const link = selectElements[i];

      // Ouvrir un nouvel onglet et naviguer vers l'URL du lien
      const newPage = await page.browser().newPage();
      await newPage.setViewport({ width: 800, height: 600 });
      await newPage.goto(link, { waitUntil: 'domcontentloaded' });
      newPage.on('dialog', async (dialog) => {
        await dialog.accept();
      });

      await newPage.mouse.click(175, 222);
      await delay(1000);
      log("Annonce désactivé");
      await newPage.mouse.click(145, 190);
      await newPage.mouse.click(45, 107);
      await newPage.mouse.click(45, 127);
      await newPage.mouse.click(45, 207);
      await newPage.mouse.click(45, 227);
      await newPage.mouse.click(45, 240);
      await newPage.mouse.click(88, 346);
      await delay(1000);
      await newPage.mouse.click(204, 189);
      await newPage.mouse.click(252, 300);
      await delay(1000);
      await newPage.mouse.click(369, 273);
      await newPage.mouse.click(348, 322);
      await newPage.mouse.click(380, 473);
      await delay(1000);


      await modifySurface(newPage)
      await delay(1000); // Attendre un peu après le scroll

      await switchImage(newPage)
      await newPage.evaluate(() => {
        window.scrollTo(0, 200); // Scroller vers le bas de la page
      });
      await newPage.mouse.click(398, 564);
      await delay(1000); // Attendre un peu après le scroll
      await publish(newPage)
      log(`Offre ${i + 1 } sur ${selectElements.length}`)
      await newPage.close();

    }
  } catch (error) {
    log(`Une erreur s'est produite : ${error.message}`);
  }
};


module.exports = { list_offre };