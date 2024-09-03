const puppeteer = require('puppeteer');

const baseUrl = 'https://opcoes.net.br/opcoes/bovespa/';



async function getAtivosURL() {

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null
    });
    const page = await browser.newPage();
    await page.goto(baseUrl)


    await page.waitForSelector('select[name="IdAcao"] option[value]')


    let ativos = []
    await page.$$eval('select[name="IdAcao"] option[value]', e => e.map(
        i => i.text
    )).then(opts => {
        for (let i = 0; i < opts.length; i++) {
            ativos.push(baseUrl + opts[i])
        }
    })

    await browser.close()


    return ativos
}



async function acess() {


    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
    });
    const page = await browser.newPage();


    let ativos = await getAtivosURL()

    for (let url of ativos) {
        await page.goto(url)

        await page.waitForSelector('button.buttons-excel')

        await page._client().send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: './tabelas' })

        await page.click('button.buttons-excel', { clickCount: 1, delay: 0 })

        console.log(`downloaded: ${url}`)

    }

    await browser.close();
}
acess()