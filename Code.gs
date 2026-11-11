/**
 * Calculadora de Substituições — Google Apps Script
 *
 * Como usar:
 * 1. Crie uma Planilha Google e abra Extensões > Apps Script.
 * 2. Cole este arquivo em Code.gs e crie um arquivo HTML chamado "Index" com o arquivo Index.html.
 * 3. Rode a função setup() uma vez (cria as abas "Alimentos" e "Config" com dados de exemplo).
 * 4. Implantar > Nova implantação > App da Web
 *    Executar como: Eu | Quem pode acessar: Qualquer pessoa.
 *
 * Se o script NÃO estiver vinculado à planilha, cole o ID dela em SPREADSHEET_ID.
 */

const SPREADSHEET_ID = ''; // opcional
const ABA_ALIMENTOS = 'Alimentos';
const ABA_CONFIG = 'Config';

function doGet(e) {
  const dados = getDados();

  // Permite servir os dados como API JSON caso o site web externo solicite (?format=json)
  if (e && e.parameter && e.parameter.format === 'json') {
    return ContentService
      .createTextOutput(JSON.stringify(dados))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const t = HtmlService.createTemplateFromFile('Index');
  // Escapa "<" para o JSON não quebrar a tag <script>
  t.dadosJson = JSON.stringify(dados).replace(/</g, '\\u003c');
  t.titulo = dados.config.nome || 'Substituições';
  return t.evaluate()
    .setTitle(t.titulo + ' · Tabela de substituição')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function planilha_() {
  return SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
}

/** Lê a planilha e devolve { config, grupos: [{ nome, alimentos: [{ nome, kcal }] }] } */
function getDados() {
  const ss = planilha_();

  // Config: coluna A = chave, coluna B = valor
  const config = {};
  const abaCfg = ss.getSheetByName(ABA_CONFIG);
  if (abaCfg) {
    abaCfg.getDataRange().getValues().slice(1).forEach(([k, v]) => {
      if (k) config[String(k).trim()] = String(v).trim();
    });
  }

  // Alimentos: Grupo | Alimento | kcal por 100 g
  const grupos = [];
  const porNome = {};
  const abaAli = ss.getSheetByName(ABA_ALIMENTOS);
  if (abaAli) {
    abaAli.getDataRange().getValues().slice(1).forEach(([grupo, nome, kcal]) => {
      grupo = String(grupo).trim();
      nome = String(nome).trim();
      kcal = Number(String(kcal).replace(',', '.'));
      if (!grupo || !nome || !(kcal > 0)) return;
      if (!porNome[grupo]) {
        porNome[grupo] = { nome: grupo, alimentos: [] };
        grupos.push(porNome[grupo]);
      }
      porNome[grupo].alimentos.push({ nome: nome, kcal: kcal });
    });
  }
  grupos.forEach(g => g.alimentos.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')));

  return { config: config, grupos: grupos };
}

/** Menu na planilha */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Substituições')
    .addItem('Criar abas de exemplo', 'setup')
    .addToUi();
}

/** Cria as abas com dados de exemplo (valores aproximados, revise com a sua tabela de referência). */
function setup() {
  const ss = planilha_();

  let cfg = ss.getSheetByName(ABA_CONFIG) || ss.insertSheet(ABA_CONFIG);
  cfg.clear();
  cfg.getRange(1, 1, 7, 2).setValues([
    ['Chave', 'Valor'],
    ['nome', 'Marcone Ramos Nutri'],
    ['subtitulo', 'Nutricionista · CRN 51047'],
    ['whatsapp', '558184445268'],
    ['instagram', '/marconeramosnutri/'],
    ['logoUrl', ''],
    ['aviso', 'As quantidades são aproximadas e equivalem em calorias. Siga sempre as orientações do seu plano alimentar.']
  ]);
  cfg.getRange('A1:B1').setFontWeight('bold');
  cfg.setColumnWidth(2, 420);

  const dados = {
    'Frutas': [
      ['Abacate', 96], ['Abacaxi', 48], ['Acerola', 33], ['Ameixa', 53], ['Amora', 43],
      ['Banana', 98], ['Bergamota/Tangerina', 38], ['Caqui', 71], ['Goiaba', 54],
      ['Jabuticaba', 58], ['Kiwi', 51], ['Laranja', 37], ['Maçã', 56], ['Mamão', 40],
      ['Manga', 64], ['Maracujá', 68], ['Melancia', 33], ['Melão', 29], ['Mirtilo', 57],
      ['Morango', 30], ['Pera', 53], ['Pêssego', 36], ['Physalis', 53], ['Pitaya', 50],
      ['Tâmara', 282], ['Uva', 53]
    ],
    'Gordura vegetal': [
      ['Abacate', 96], ['Amêndoas', 604], ['Amendoim', 544], ['Castanha-do-pará', 643],
      ['Nozes', 620], ['Óleos vegetais', 884]
    ],
    'Carboidratos': [
      ['Abóbora cabotiá', 48], ['Água de coco', 22], ['Amido de milho', 361],
      ['Arroz branco ou integral (cozido)', 128], ['Aveia', 394],
      ['Batata-baroa (mandioquinha)', 80], ['Batata-doce', 77], ['Batata-inglesa', 52],
      ['Cuscuz (desidratado)', 360], ['Farinha de mandioca', 365], ['Feijão (cozido)', 76],
      ['Macarrão (cozido)', 102], ['Mandioca (cozida)', 125], ['Pão francês', 300],
      ['Pinhão (cozido)', 174], ['Pipoca', 387], ['Polenta', 70], ['Polpa de açaí', 58],
      ['Suco de uva integral', 58], ['Tapioca (goma)', 240]
    ],
    'Proteína': [
      ['Albumina', 372], ['Atum em água e sal', 116], ['Atum light', 100],
      ['Camarão cozido ou assado', 90], ['Carne vermelha magra', 219], ['Clara de ovo', 59],
      ['Filé de frango', 159], ['Fígado bovino', 225], ['Lombo suíno', 210],
      ['Ovo inteiro', 146], ['Peixe de água doce', 128], ['Salmão sem pele', 229],
      ['Soja texturizada crua', 330], ['Tofu cru', 76], ['Whey protein', 400]
    ],
    'Laticínios': [
      ['Iogurte 2 Ingredientes Nestlé Desnatado', 36], ['Iogurte 2 Ingredientes Nestlé Integral', 77],
      ['Iogurte Batavo Grego Zero 10+ Pedaços', 62], ['Iogurte Grego Vigor Zero', 56],
      ['Leite desnatado', 34], ['Leite em pó desnatado', 362], ['Leite em pó integral', 497],
      ['Leite integral', 58], ['Leite semidesnatado', 49], ['Queijo cottage', 100],
      ['Queijo minas frescal', 264], ['Queijo minas meia cura', 330], ['Queijo quark', 82],
      ['Queijo ricota', 140], ['Queijos amarelos', 360], ['Requeijão light', 180]
    ]
  };

  const linhas = [['Grupo', 'Alimento', 'kcal por 100 g']];
  Object.keys(dados).forEach(g => dados[g].forEach(([n, k]) => linhas.push([g, n, k])));

  let ali = ss.getSheetByName(ABA_ALIMENTOS) || ss.insertSheet(ABA_ALIMENTOS);
  ali.clear();
  ali.getRange(1, 1, linhas.length, 3).setValues(linhas);
  ali.getRange('A1:C1').setFontWeight('bold');
  ali.setFrozenRows(1);
  ali.autoResizeColumns(1, 3);
}

