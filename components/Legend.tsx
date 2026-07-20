export function Legend() {
  return (
    <section id="legend">
      <h2 className="section-title">見分け方の基本カテゴリ</h2>
      <p className="section-sub">電力会社ごとに違いが出やすい5つのポイント。まずはこれらの「見る場所」を覚えましょう。</p>
      <div className="legend-grid">
        <div className="legend-item">
          <svg className="icon" viewBox="0 0 40 40">
            <polygon points="20,6 32,30 8,30" fill="none" stroke="var(--part-guywire)" strokeWidth="2.5" />
          </svg>
          <h4>① 支線プレート(支線標識)</h4>
          <p>
            電柱を斜めに支える「支線(ワイヤー)」の目印板。三角・丸・四角など会社ごとに形と色の規格が違い、最も判別しやすい特徴のひとつ。
          </p>
        </div>
        <div className="legend-item">
          <svg className="icon" viewBox="0 0 40 40">
            <rect x="16" y="4" width="8" height="32" rx="2" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5" />
          </svg>
          <h4>② 電柱本体の色・素材</h4>
          <p>
            コンクリート柱の色味(灰色/やや茶色)や継ぎ目の位置、木柱の残存率など。地域差はあるが単独では判断しにくい補助的特徴。
          </p>
        </div>
        <div className="legend-item">
          <svg className="icon" viewBox="0 0 40 40">
            <rect x="10" y="12" width="20" height="16" rx="8" fill="none" stroke="var(--part-transformer)" strokeWidth="2.5" />
          </svg>
          <h4>③ 変圧器(トランス)の形</h4>
          <p>柱上変圧器(円柱の缶)のサイズ・取付方法。円柱形の太さや台座の形状に会社ごとの傾向がある。</p>
        </div>
        <div className="legend-item">
          <svg className="icon" viewBox="0 0 40 40">
            <rect x="8" y="15" width="24" height="10" rx="2" fill="none" stroke="var(--part-plate)" strokeWidth="2.5" />
            <line x1="12" y1="19" x2="28" y2="19" stroke="var(--part-plate)" strokeWidth="1.5" />
          </svg>
          <h4>④ 番号プレート・注意プレート</h4>
          <p>電柱番号札の色(白地/黄色地)やフォント、注意書きプレートのデザイン。接写できる場面では最も確実な手がかり。</p>
        </div>
        <div className="legend-item">
          <svg className="icon" viewBox="0 0 40 40">
            <ellipse cx="20" cy="14" rx="7" ry="3" fill="none" stroke="var(--part-insulator)" strokeWidth="2.5" />
            <ellipse cx="20" cy="19" rx="7" ry="3" fill="none" stroke="var(--part-insulator)" strokeWidth="2.5" />
            <ellipse cx="20" cy="24" rx="7" ry="3" fill="none" stroke="var(--part-insulator)" strokeWidth="2.5" />
          </svg>
          <h4>⑤ がいし(碍子)の色</h4>
          <p>電線を支える絶縁体。グレー・茶色・白など塗色や素材の違いが会社ごとの傾向として現れることがある。</p>
        </div>
      </div>
    </section>
  );
}
