const puppeteer = require('puppeteer');
const path = require('path');

// スクリーンショットを撮るLPの一覧
const targets = [
  {
    name: 'hair-salon-bloom',
    file: path.resolve(__dirname, '../hair-salon-bloom/index.html'),
    output: path.resolve(__dirname, 'images/hair-salon-bloom.png'),
  },
  {
    name: 'sakura-seikotsu',
    file: path.resolve(__dirname, '../sakura-seikotsu/index.html'),
    output: path.resolve(__dirname, 'images/sakura-seikotsu.png'),
  },
  {
    name: 'wagyu-tei',
    file: path.resolve(__dirname, '../wagyu-tei/index.html'),
    output: path.resolve(__dirname, 'images/wagyu-tei.png'),
  },
  {
    name: 'fudosan-lp',
    file: path.resolve(__dirname, '../fudosan-lp/index.html'),
    output: path.resolve(__dirname, 'images/fudosan-lp.png'),
  },
  {
    name: 'juku-next',
    file: path.resolve(__dirname, '../juku-next/index.html'),
    output: path.resolve(__dirname, 'images/juku-next.png'),
  },
];

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });

  for (const target of targets) {
    console.log(`📸 撮影中: ${target.name}`);
    try {
      const page = await browser.newPage();
      // PC表示（横1280px）に設定
      await page.setViewport({ width: 1280, height: 800 });
      // ローカルのHTMLファイルを開く
      await page.goto(`file://${target.file}`, { waitUntil: 'networkidle2', timeout: 15000 });
      // 少し待ってアニメーションが落ち着くのを待つ
      await new Promise(r => setTimeout(r, 1500));
      // ページ上部600×340ピクセルをキャプチャ（カードサイズに合わせる）
      await page.screenshot({
        path: target.output,
        clip: { x: 0, y: 0, width: 1280, height: 680 },
      });
      console.log(`  ✅ 保存: ${target.output}`);
      await page.close();
    } catch (err) {
      console.log(`  ❌ エラー (${target.name}): ${err.message}`);
    }
  }

  await browser.close();
  console.log('\n🎉 全て完了しました！');
})();
