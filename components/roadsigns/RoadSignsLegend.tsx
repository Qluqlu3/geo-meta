export function RoadSignsLegend() {
  return (
    <section id="legend">
      <h2 className="section-title">見分け方の基本カテゴリ</h2>
      <p className="section-sub">「標識・信号機」で地域差が出やすい5つのポイント。まずはこれらの「見る場所」を覚えましょう。</p>
      <div className="legend-grid">
        <div className="legend-item">
          <svg className="icon" viewBox="0 0 40 40">
            <rect x="14" y="4" width="12" height="26" rx="6" fill="none" stroke="var(--rs-vertical)" strokeWidth="2.5" />
            {[10, 17, 24].map((cy) => (
              <circle key={cy} cx="20" cy={cy} r="2" fill="var(--rs-vertical)" />
            ))}
          </svg>
          <h4>① 信号機の形</h4>
          <p>縦型/横型(積雪対策)、庇(ひさし)の有無、LED化率、一灯点滅式など。気候・警察本部の更新方針で地域差が出る。</p>
        </div>
        <div className="legend-item">
          <svg className="icon" viewBox="0 0 40 40">
            <rect x="7" y="14" width="26" height="12" rx="2" fill="none" stroke="var(--part-plate)" strokeWidth="2.5" />
            <line x1="11" y1="20" x2="29" y2="20" stroke="var(--part-plate)" strokeWidth="1.5" />
          </svg>
          <h4>② 公安委員会の補助標識</h4>
          <p>
            規制標識の下に付く「◯◯県公安委員会」のシール。都道府県名が直接入るが、字体・色・取付位置の違いで判別するのが実用的。
          </p>
        </div>
        <div className="legend-item">
          <svg className="icon" viewBox="0 0 40 40">
            <polygon points="20,4 36,20 20,36 4,20" fill="none" stroke="#c98a2f" strokeWidth="2.5" />
          </svg>
          <h4>③ 警戒標識の絵柄</h4>
          <p>
            黄色ひし形の「動物注意」標識は、シカ・サル・ウサギ・タヌキ以外は道路管理者の裁量で絵柄を変えてよく、地域固有の動物が描かれる。
          </p>
        </div>
        <div className="legend-item">
          <svg className="icon" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="15" fill="none" stroke="var(--c-hokkaido)" strokeWidth="2.5" />
            <line x1="20" y1="10" x2="20" y2="30" stroke="var(--c-hokkaido)" strokeWidth="1.6" />
            <line x1="10" y1="20" x2="30" y2="20" stroke="var(--c-hokkaido)" strokeWidth="1.6" />
          </svg>
          <h4>④ 気象・規制標識</h4>
          <p>チェーン規制標識は全国13区間に限定設置。見つかれば逆にどの峠かをほぼ一意特定できる、ピンポイントで強い手がかり。</p>
        </div>
        <div className="legend-item">
          <svg className="icon" viewBox="0 0 40 40">
            <path
              d="M6 8 Q20 5 34 8 Q37 9 36 12 L22 33 Q20 36 18 33 L4 12 Q3 9 6 8 Z"
              fill="none"
              stroke="var(--nr-route)"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>
          <h4>⑤ 国道番号(おにぎり)</h4>
          <p>3桁国道は指定年ごとに北→南の順で付番。番号が読めれば、路線の通過都道府県から数県〜1県まで一気に絞れる。</p>
        </div>
      </div>
    </section>
  );
}
