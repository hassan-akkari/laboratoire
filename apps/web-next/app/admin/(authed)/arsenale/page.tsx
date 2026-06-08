import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arsenale mentale — Admin",
};

// Personal reading dossier ("arsenale mentale"): 36-book roadmap. Originally a
// standalone HTML page (resources/arsenale-mentale.html); ported here as a
// gated admin route. Markup + styles are kept self-contained and scoped under
// .arsenale-root so the page-unique class names and CSS variables never leak
// into the admin shell (web-next has no Tailwind — see the admin design spec).
// Static content, no data dependency. Gated by the (authed) route group.

const ARSENALE_CSS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,900&family=Hanken+Grotesk:wght@400;500;700&display=swap');

  .arsenale-root{
    --bg:#0d1311; --bg2:#121a17; --panel:#141d1a;
    --ink:#ECEFEA; --muted:#94A89E; --faint:#6B7A73;
    --accent:#4FD1A5; --accent-deep:#2A8C6D;
    --ice:#86BAD6; --crimson:#E66A82;
    --line:rgba(236,239,234,0.10); --line2:rgba(236,239,234,0.06);
    --display:'Fraunces',Georgia,'Times New Roman',serif;
    --body:'Hanken Grotesk',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  }
  .arsenale-root *{box-sizing:border-box;margin:0;padding:0}
  
  .arsenale-root{
    background:var(--bg); color:var(--ink); font-family:var(--body);
    font-size:16px; line-height:1.6; -webkit-font-smoothing:antialiased;
    overflow-x:hidden; position:relative;
  }
  .arsenale-root::before{
    content:""; position:absolute; inset:0; pointer-events:none; z-index:0;
    background:
      radial-gradient(60% 45% at 12% -5%, rgba(79,209,165,0.10), transparent 60%),
      radial-gradient(50% 40% at 100% 0%, rgba(134,186,214,0.06), transparent 55%);
  }
  .wrap{position:relative; z-index:1; max-width:900px; margin:0 auto; padding:0 26px}

  /* HERO */
  .hero{padding:72px 0 30px; animation:rise .8s cubic-bezier(.2,.7,.2,1) both}
  .kicker{font-size:12px; letter-spacing:.32em; text-transform:uppercase; color:var(--accent); font-weight:700}
  .kicker .dot{color:var(--faint)}
  .arsenale-root h1{font-family:var(--display); font-weight:900; font-size:clamp(38px,7.5vw,72px); line-height:.98; letter-spacing:-.02em; margin:14px 0 0; font-optical-sizing:auto}
  .arsenale-root h1 em{font-style:italic; color:var(--accent)}
  .lead{color:var(--muted); font-size:18px; max-width:60ch; margin-top:18px}
  .rule{height:1px; background:var(--line); margin:34px 0 0}

  /* NAV */
  .arsenale-root nav.jump{position:sticky; top:0; z-index:5; background:rgba(13,19,17,.82); backdrop-filter:blur(10px); border-bottom:1px solid var(--line2); margin-top:8px}
  .arsenale-root nav.jump .row{display:flex; gap:8px; flex-wrap:wrap; padding:13px 0}
  .arsenale-root nav.jump a{font-size:12.5px; letter-spacing:.04em; color:var(--muted); text-decoration:none; padding:6px 12px; border:1px solid var(--line); border-radius:999px; transition:.18s; white-space:nowrap}
  .arsenale-root nav.jump a:hover{color:var(--bg); background:var(--accent); border-color:var(--accent)}
  .arsenale-root section{padding:52px 0; animation:rise .7s ease both}
  .eyebrow{font-size:12px; letter-spacing:.28em; text-transform:uppercase; color:var(--faint); font-weight:700; margin-bottom:8px}
  .arsenale-root h2{font-family:var(--display); font-weight:600; font-size:clamp(26px,4.5vw,38px); letter-spacing:-.01em; line-height:1.05}
  .sub{color:var(--muted); margin-top:10px; max-width:62ch}

  /* DIAGNOSI */
  .diag{background:linear-gradient(180deg,var(--bg2),transparent); border:1px solid var(--line); border-left:3px solid var(--accent); border-radius:14px; padding:26px 28px}
  .diag p{margin:0 0 14px}
  .diag p:last-child{margin:0}
  .diag b{color:var(--ink)}
  .diag .hi{color:var(--accent); font-weight:700}

  /* PRIMI 3 */
  .three{display:grid; grid-template-columns:repeat(3,1fr); gap:16px}
  .pc{background:var(--panel); border:1px solid var(--line); border-radius:16px; padding:22px 20px; transition:.22s}
  .pc:hover{transform:translateY(-4px); border-color:var(--accent-deep)}
  .pc .n{font-family:var(--display); font-size:40px; font-weight:900; color:var(--accent); line-height:1}
  .pc h3{font-family:var(--display); font-size:21px; font-weight:600; margin:12px 0 2px}
  .pc .au{color:var(--faint); font-size:13.5px; margin-bottom:10px}
  .pc p{color:var(--muted); font-size:14.5px; margin:0}

  /* TOP10 */
  .top{display:grid; grid-template-columns:1fr 1fr; gap:4px 34px}
  .ti{display:flex; gap:14px; align-items:baseline; padding:11px 0; border-bottom:1px solid var(--line2)}
  .ti .r{font-family:var(--display); font-weight:900; font-size:20px; color:var(--accent-deep); min-width:26px}
  .ti .t{font-weight:700}
  .ti .d{display:block; color:var(--muted); font-size:13.5px; font-weight:400}

  /* CATEGORY */
  .cat{margin-top:30px}
  .cathead{display:flex; align-items:center; gap:14px; margin-bottom:6px}
  .badge{font-family:var(--display); font-weight:900; font-size:18px; color:var(--bg); background:var(--accent); width:34px; height:34px; display:grid; place-items:center; border-radius:9px; flex:none}
  .cathead h3{font-family:var(--display); font-weight:600; font-size:22px; letter-spacing:-.01em}
  .cathead .tag{color:var(--faint); font-size:13px; margin-left:auto; text-align:right}

  .book{padding:16px 0; border-bottom:1px solid var(--line2)}
  .book:last-child{border-bottom:0}
  .book .h{display:flex; gap:10px; align-items:baseline; flex-wrap:wrap}
  .book .ttl{font-weight:700; font-size:16.5px}
  .book .by{color:var(--faint); font-size:13.5px}
  .new{font-size:10px; letter-spacing:.12em; font-weight:700; text-transform:uppercase; color:var(--bg); background:var(--ice); padding:2px 7px; border-radius:5px}
  .desc{color:var(--muted); font-size:14.5px; margin:6px 0 10px}
  .metrics{display:flex; gap:7px; flex-wrap:wrap; align-items:center}
  .m{font-size:12px; color:var(--faint); border:1px solid var(--line); border-radius:999px; padding:3px 9px}
  .m b{color:var(--ink); font-weight:700}
  .when{font-size:12px; color:var(--ice); border:1px solid rgba(134,186,214,.35); border-radius:999px; padding:3px 10px; font-weight:500}

  /* ROADMAP */
  .road{display:grid; gap:14px}
  .mo{display:grid; grid-template-columns:84px 1fr; gap:18px; background:var(--bg2); border:1px solid var(--line); border-radius:14px; padding:18px 20px}
  .mo .when2{font-family:var(--display); font-weight:900; font-size:15px; color:var(--accent)}
  .mo .ph{font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--faint); margin-top:5px}
  .mo .bk{font-weight:700; font-size:15.5px}
  .mo .ino{color:var(--muted); font-size:13.5px; margin-top:7px}
  .mo .ino span{color:var(--ice); font-weight:600}
  .ph5{border:1px dashed var(--line); border-radius:14px; padding:18px 20px; color:var(--muted); font-size:14px; margin-top:6px}
  .ph5 b{color:var(--ink)}

  /* MODES */
  .modes{display:grid; grid-template-columns:repeat(3,1fr); gap:16px}
  .mode{background:var(--panel); border:1px solid var(--line); border-radius:14px; padding:20px}
  .mode h4{font-family:var(--display); font-size:17px; font-weight:600; margin-bottom:4px}
  .mode .mt{font-size:11.5px; letter-spacing:.06em; color:var(--faint); text-transform:uppercase; margin-bottom:12px}
  .mode ul{list-style:none}
  .mode li{font-size:14px; color:var(--muted); padding:5px 0; border-bottom:1px solid var(--line2)}
  .mode li:last-child{border:0}
  .mode li b{color:var(--ink); font-weight:600}

  /* AVOID */
  .avoid{border:1px solid rgba(230,106,130,.22); border-radius:14px; padding:8px 24px; background:linear-gradient(180deg,rgba(230,106,130,.05),transparent)}
  .avoid .ai{padding:13px 0; border-bottom:1px solid var(--line2); font-size:14.5px; color:var(--muted)}
  .avoid .ai:last-child{border:0}
  .avoid .ai b{color:var(--crimson); font-weight:700}

  /* READ */
  .read{display:grid; gap:14px; counter-reset:r}
  .ri{display:grid; grid-template-columns:42px 1fr; gap:14px; align-items:start}
  .ri::before{counter-increment:r; content:counter(r); font-family:var(--display); font-weight:900; font-size:26px; color:var(--accent-deep)}
  .ri b{color:var(--ink)}
  .ri p{color:var(--muted); font-size:15px}
  .arsenale-root footer{padding:46px 0 70px; color:var(--faint); font-size:13.5px; border-top:1px solid var(--line2); margin-top:20px}
  .arsenale-root footer b{color:var(--muted)}

  @keyframes rise{from{opacity:0; transform:translateY(18px)}to{opacity:1; transform:none}}

  @media(max-width:720px){
    .three,.modes{grid-template-columns:1fr}
    .top{grid-template-columns:1fr}
    .mo{grid-template-columns:1fr; gap:6px}
    .hero{padding:54px 0 20px}
  .arsenale-root section{padding:40px 0}
  }
`;

const ARSENALE_HTML = `<div class="wrap">

  <header class="hero">
    <div class="kicker">Dossier personale <span class="dot">/</span> 36 libri <span class="dot">/</span> v.1</div>
    <h1>Il tuo <em>arsenale</em><br>mentale</h1>
    <p class="lead">Non una lista di self-help. Un percorso costruito per trasformare il tuo potenziale caotico in potere direzionato — pesato sul tuo vero collo di bottiglia, non sui titoli famosi.</p>
    <div class="rule"></div>
  </header>

  <nav class="jump"><div class="row">
    <a href="#diagnosi">Diagnosi</a>
    <a href="#primi3">I primi 3</a>
    <a href="#top10">Top 10</a>
    <a href="#categorie">Le 7 categorie</a>
    <a href="#roadmap">Roadmap 6 mesi</a>
    <a href="#modes">Hard / Practical / Relazioni</a>
    <a href="#evitare">Da evitare</a>
    <a href="#come">Come leggerli</a>
  </div></nav>

  <section id="diagnosi">
    <div class="eyebrow">La diagnosi</div>
    <h2>Cosa ti serve davvero</h2>
    <div class="sub" style="margin-bottom:22px">Tre verità che hanno deciso come è costruito questo arsenale.</div>
    <div class="diag">
      <p><span class="hi">Il collo di bottiglia non è l'input, è la conversione.</span> Hai surplus di idee e di intuizione. Ti manca lo strato che le fa diventare output: scegliere una linea, restarci senza pressione, chiudere. Per questo il peso è su <b>esecuzione → focus → chiusura → stabilità emotiva</b>, e solo dopo strategia e leverage. I libri "potenti e affascinanti" sono la minoranza; le fondamenta sono i libri noiosi sui sistemi.</p>
      <p><span class="hi">Il dolore come carburante è il difetto da disinnescare.</span> Soffri → spingi; stai bene → molli. Significa che il motore è appaltato alla tua sofferenza. Non si ripara con più forza di volontà: si sposta la fonte del carburante su <b>identità, significato e sistemi</b> — così gira anche in tempo di pace.</p>
      <p><span class="hi">I libri di potere sono lenti, non script.</span> Greene, Cialdini, Taraban: utili per <i>vedere</i> le dinamiche e non farti sfruttare. Pericolosi se diventano il tuo sistema operativo relazionale. Ogni libro "freddo" è accoppiato a uno di connessione reale. Si leggono in coppia.</p>
    </div>
  </section>

  <section id="primi3">
    <div class="eyebrow">Inizia da qui</div>
    <h2>I primi 3, adesso</h2>
    <div class="sub" style="margin-bottom:24px">Attaccano esattamente il loop che hai descritto: disciplina dipendente dal dolore, falle di dopamina, progetti non chiusi. Non invertire l'ordine.</div>
    <div class="three">
      <div class="pc"><div class="n">01</div><h3>Atomic Habits</h3><div class="au">James Clear</div><p>Costruisci la base. Senza costanza, ogni altro libro resta teoria.</p></div>
      <div class="pc"><div class="n">02</div><h3>Dopamine Nation</h3><div class="au">Anna Lembke</div><p>La falla di dopamina sta drenando l'energia che serve a tutto il resto.</p></div>
      <div class="pc"><div class="n">03</div><h3>The War of Art</h3><div class="au">Steven Pressfield</div><p>Inizia a chiudere. È la meta-skill che fa pagare l'intera libreria.</p></div>
    </div>
  </section>

  <section id="top10">
    <div class="eyebrow">Priorità</div>
    <h2>Top 10, in ordine</h2>
    <div class="sub" style="margin-bottom:22px">Pesata sul tuo vero collo di bottiglia: conversione e stabilità, poi leverage.</div>
    <div class="top">
      <div class="ti"><span class="r">1</span><span class="t">Atomic Habits<span class="d">il motore d'identità</span></span></div>
      <div class="ti"><span class="r">2</span><span class="t">Dopamine Nation<span class="d">chiude la falla di stimoli</span></span></div>
      <div class="ti"><span class="r">3</span><span class="t">The War of Art<span class="d">il problema della chiusura</span></span></div>
      <div class="ti"><span class="r">4</span><span class="t">So Good They Can't Ignore You<span class="d">la tesi del tuo obiettivo #1</span></span></div>
      <div class="ti"><span class="r">5</span><span class="t">Man's Search for Meaning<span class="d">carburante che non sia il dolore</span></span></div>
      <div class="ti"><span class="r">6</span><span class="t">Attached<span class="d">la chiave attaccamento / validazione</span></span></div>
      <div class="ti"><span class="r">7</span><span class="t">The Almanack of Naval Ravikant<span class="d">leverage e indipendenza</span></span></div>
      <div class="ti"><span class="r">8</span><span class="t">The Laws of Human Nature<span class="d">capire persone e potere</span></span></div>
      <div class="ti"><span class="r">9</span><span class="t">Deep Work<span class="d">il fossato professionale</span></span></div>
      <div class="ti"><span class="r">10</span><span class="t">Never Split the Difference<span class="d">converte il valore in soldi</span></span></div>
    </div>
  </section>

  <section id="categorie">
    <div class="eyebrow">L'arsenale completo</div>
    <h2>I 36 libri, per categoria</h2>
    <div class="sub">Per ogni libro: cosa colpisce, e una riga di metrica — <b>P</b> pratico · <b>T</b> trasformativo · <b>D</b> difficoltà (su 10) — più quando leggerlo. Il badge segnala le aggiunte uscite dalla nostra conversazione.</div>

    <!-- A -->
    <div class="cat">
      <div class="cathead"><div class="badge">A</div><h3>Sistema operativo personale</h3><div class="tag">identità · disciplina · focus · dopamina</div></div>
      <div class="book"><div class="h"><span class="ttl">Atomic Habits</span><span class="by">James Clear</span></div><div class="desc">Disciplina dall'identità, non dal dolore: il capitolo che quasi tutti saltano.</div><div class="metrics"><span class="m">P<b> 9</b></span><span class="m">T<b> 8</b></span><span class="m">D<b> 3</b></span><span class="when">subito</span></div></div>
      <div class="book"><div class="h"><span class="ttl">Dopamine Nation</span><span class="by">Anna Lembke</span></div><div class="desc">Il meccanismo vero dietro telefono/porno/stimoli, da una psichiatra delle dipendenze. Niente moralismo.</div><div class="metrics"><span class="m">P<b> 8</b></span><span class="m">T<b> 9</b></span><span class="m">D<b> 4</b></span><span class="when">subito</span></div></div>
      <div class="book"><div class="h"><span class="ttl">Indistractable</span><span class="by">Nir Eyal</span></div><div class="desc">Afferri il telefono per scappare da un disagio interno: trazione vs distrazione, timeboxing.</div><div class="metrics"><span class="m">P<b> 9</b></span><span class="m">T<b> 6</b></span><span class="m">D<b> 3</b></span><span class="when">subito</span></div></div>
      <div class="book"><div class="h"><span class="ttl">Deep Work</span><span class="by">Cal Newport</span></div><div class="desc">La concentrazione profonda come fossato competitivo: alza il tuo valore di mercato.</div><div class="metrics"><span class="m">P<b> 8</b></span><span class="m">T<b> 7</b></span><span class="m">D<b> 4</b></span><span class="when">presto</span></div></div>
      <div class="book"><div class="h"><span class="ttl">The One Thing</span><span class="by">Keller &amp; Papasan</span></div><div class="desc">Antidoto alla dispersione ENTP: la focusing question, una cosa sola per volta.</div><div class="metrics"><span class="m">P<b> 8</b></span><span class="m">T<b> 6</b></span><span class="m">D<b> 3</b></span><span class="when">presto</span></div></div>
      <div class="book"><div class="h"><span class="ttl">Building a Second Brain</span><span class="by">Tiago Forte</span><span class="new">nuovo</span></div><div class="desc">Sistema di conoscenza (metodo CODE) per chi annega di idee. Leggilo quando monti il Notion.</div><div class="metrics"><span class="m">P<b> 9</b></span><span class="m">T<b> 7</b></span><span class="m">D<b> 3</b></span><span class="when">Fase 1</span></div></div>
    </div>

    <!-- B -->
    <div class="cat">
      <div class="cathead"><div class="badge">B</div><h3>Capire te stesso emotivamente</h3><div class="tag">attaccamento · ego · validazione · significato</div></div>
      <div class="book"><div class="h"><span class="ttl">Attached</span><span class="by">Levine &amp; Heller</span></div><div class="desc">La chiave dell'attaccamento ansioso/evitante e della trappola che brucia lucidità.</div><div class="metrics"><span class="m">P<b> 8</b></span><span class="m">T<b> 9</b></span><span class="m">D<b> 3</b></span><span class="when">presto</span></div></div>
      <div class="book"><div class="h"><span class="ttl">No More Mr. Nice Guy</span><span class="by">Robert Glover</span></div><div class="desc">I contratti occulti e la ricerca di approvazione. Scomodo e preciso sul tuo pattern.</div><div class="metrics"><span class="m">P<b> 8</b></span><span class="m">T<b> 8</b></span><span class="m">D<b> 3</b></span><span class="when">presto</span></div></div>
      <div class="book"><div class="h"><span class="ttl">Man's Search for Meaning</span><span class="by">Viktor Frankl</span></div><div class="desc">Il significato, non il dolore, come carburante. La radice del "funzionare in pace".</div><div class="metrics"><span class="m">P<b> 5</b></span><span class="m">T<b> 10</b></span><span class="m">D<b> 4</b></span><span class="when">subito</span></div></div>
      <div class="book"><div class="h"><span class="ttl">12 Rules for Life</span><span class="by">Jordan Peterson</span><span class="new">nuovo</span></div><div class="desc">Ordine dal caos, responsabilità, significato: paralo con Frankl e lo Stoicismo. Prendi il Peterson clinico, lascia quello politico.</div><div class="metrics"><span class="m">P<b> 6</b></span><span class="m">T<b> 8</b></span><span class="m">D<b> 5</b></span><span class="when">presto</span></div></div>
      <div class="book"><div class="h"><span class="ttl">Ego Is the Enemy</span><span class="by">Ryan Holiday</span></div><div class="desc">L'ego che ti fa inseguire la validazione invece della sostanza.</div><div class="metrics"><span class="m">P<b> 6</b></span><span class="m">T<b> 7</b></span><span class="m">D<b> 3</b></span><span class="when">presto</span></div></div>
      <div class="book"><div class="h"><span class="ttl">The Body Keeps the Score</span><span class="by">Bessel van der Kolk</span></div><div class="desc">Come le ferite vivono nel corpo. Pesante: leggilo da stabile. Un libro è la mappa, il terapeuta è il territorio.</div><div class="metrics"><span class="m">P<b> 5</b></span><span class="m">T<b> 9</b></span><span class="m">D<b> 7</b></span><span class="when">quando sei stabile</span></div></div>
      <div class="book"><div class="h"><span class="ttl">A Guide to the Good Life</span><span class="by">William Irvine</span></div><div class="desc">Stoicismo pratico: dicotomia del controllo, visualizzazione negativa. Il motore emotivo da tempo di pace.</div><div class="metrics"><span class="m">P<b> 8</b></span><span class="m">T<b> 8</b></span><span class="m">D<b> 4</b></span><span class="when">presto</span></div></div>
    </div>

    <!-- C -->
    <div class="cat">
      <div class="cathead"><div class="badge">C</div><h3>Capire le persone e le relazioni</h3><div class="tag">potere · desiderio · comunicazione · confini</div></div>
      <div class="book"><div class="h"><span class="ttl">The Laws of Human Nature</span><span class="by">Robert Greene</span></div><div class="desc">Lettura psicologica profonda delle persone, con più sostanza delle 48 Leggi.</div><div class="metrics"><span class="m">P<b> 7</b></span><span class="m">T<b> 8</b></span><span class="m">D<b> 6</b></span><span class="when">dopo la base</span></div></div>
      <div class="book"><div class="h"><span class="ttl">Models</span><span class="by">Mark Manson</span></div><div class="desc">Attrazione tramite onestà e non-bisogno: l'anti-pickup. Magnetico senza essere falso.</div><div class="metrics"><span class="m">P<b> 8</b></span><span class="m">T<b> 8</b></span><span class="m">D<b> 3</b></span><span class="when">presto</span></div></div>
      <div class="book"><div class="h"><span class="ttl">The Value of Others</span><span class="by">Orion Taraban</span><span class="new">nuovo</span></div><div class="desc">Il framework transazionale sistematizzato. Lente, non vangelo: leggilo accanto ad Attached, Models e Perel.</div><div class="metrics"><span class="m">P<b> 6</b></span><span class="m">T<b> 6</b></span><span class="m">D<b> 4</b></span><span class="when">come lente</span></div></div>
      <div class="book"><div class="h"><span class="ttl">Games People Play</span><span class="by">Eric Berne</span><span class="new">nuovo</span></div><div class="desc">Riconoscere i copioni ripetitivi nelle relazioni. Datato (1964) ma il nucleo è utile.</div><div class="metrics"><span class="m">P<b> 7</b></span><span class="m">T<b> 7</b></span><span class="m">D<b> 5</b></span><span class="when">Fase 2/3</span></div></div>
      <div class="book"><div class="h"><span class="ttl">Mating in Captivity</span><span class="by">Esther Perel</span></div><div class="desc">La psicologia del desiderio senza cinismo: la tensione tra sicurezza e avventura.</div><div class="metrics"><span class="m">P<b> 5</b></span><span class="m">T<b> 7</b></span><span class="m">D<b> 5</b></span><span class="when">dopo</span></div></div>
      <div class="book"><div class="h"><span class="ttl">Nonviolent Communication</span><span class="by">Marshall Rosenberg</span></div><div class="desc">Comunicazione e confini puliti: osservazione → sentimento → bisogno → richiesta.</div><div class="metrics"><span class="m">P<b> 9</b></span><span class="m">T<b> 7</b></span><span class="m">D<b> 3</b></span><span class="when">presto</span></div></div>
      <div class="book"><div class="h"><span class="ttl">The Charisma Myth</span><span class="by">Olivia Fox Cabane</span></div><div class="desc">Il carisma come comportamento allenabile: presenza, potere, calore.</div><div class="metrics"><span class="m">P<b> 9</b></span><span class="m">T<b> 6</b></span><span class="m">D<b> 3</b></span><span class="when">presto</span></div></div>
    </div>

    <!-- D -->
    <div class="cat">
      <div class="cathead"><div class="badge">D</div><h3>Diventare più strategico</h3><div class="tag">decisioni · lungo termine · potere</div></div>
      <div class="book"><div class="h"><span class="ttl">Thinking, Fast and Slow</span><span class="by">Daniel Kahneman</span></div><div class="desc">La mappa dei bias: il contrappeso lento all'agire d'impulso. Denso.</div><div class="metrics"><span class="m">P<b> 5</b></span><span class="m">T<b> 8</b></span><span class="m">D<b> 8</b></span><span class="when">dopo</span></div></div>
      <div class="book"><div class="h"><span class="ttl">Thinking in Bets</span><span class="by">Annie Duke</span></div><div class="desc">Decidere sotto incertezza: separa la qualità della decisione dall'esito.</div><div class="metrics"><span class="m">P<b> 8</b></span><span class="m">T<b> 6</b></span><span class="m">D<b> 4</b></span><span class="when">presto</span></div></div>
      <div class="book"><div class="h"><span class="ttl">Good Strategy Bad Strategy</span><span class="by">Richard Rumelt</span></div><div class="desc">Cos'è una strategia vera (diagnosi + politica + azione) vs liste di obiettivi vaghi.</div><div class="metrics"><span class="m">P<b> 7</b></span><span class="m">T<b> 7</b></span><span class="m">D<b> 5</b></span><span class="when">dopo la base</span></div></div>
      <div class="book"><div class="h"><span class="ttl">The 48 Laws of Power</span><span class="by">Robert Greene</span></div><div class="desc">Antropologia del potere: leggila per riconoscere le mosse, non per diventare un serpente. Tienila come lente.</div><div class="metrics"><span class="m">P<b> 6</b></span><span class="m">T<b> 6</b></span><span class="m">D<b> 5</b></span><span class="when">come lente</span></div></div>
    </div>

    <!-- E -->
    <div class="cat">
      <div class="cathead"><div class="badge">E</div><h3>Carriera, soldi, leverage</h3><div class="tag">valore di mercato · negoziazione · capitale</div></div>
      <div class="book"><div class="h"><span class="ttl">So Good They Can't Ignore You</span><span class="by">Cal Newport</span></div><div class="desc">La tesi del tuo obiettivo #1: skill rare → il mercato ti insegue. Non "segui la passione". Lega al riposizionamento da frontend a software engineer.</div><div class="metrics"><span class="m">P<b> 9</b></span><span class="m">T<b> 8</b></span><span class="m">D<b> 3</b></span><span class="when">subito</span></div></div>
      <div class="book"><div class="h"><span class="ttl">The Almanack of Naval Ravikant</span><span class="by">Eric Jorgenson</span></div><div class="desc">Leverage, conoscenza specifica, ricchezza con la mente. Sobrio e adatto a te.</div><div class="metrics"><span class="m">P<b> 7</b></span><span class="m">T<b> 8</b></span><span class="m">D<b> 4</b></span><span class="when">presto</span></div></div>
      <div class="book"><div class="h"><span class="ttl">Mastery</span><span class="by">Robert Greene</span></div><div class="desc">Il percorso lungo verso l'eccellenza: apprendistato, profondità. L'antidoto al saltabeccare.</div><div class="metrics"><span class="m">P<b> 6</b></span><span class="m">T<b> 8</b></span><span class="m">D<b> 5</b></span><span class="when">dopo</span></div></div>
      <div class="book"><div class="h"><span class="ttl">Never Split the Difference</span><span class="by">Chris Voss</span></div><div class="desc">Negoziazione FBI: empatia tattica e il "that's right". Per la prossima trattativa salariale o di tariffa.</div><div class="metrics"><span class="m">P<b> 10</b></span><span class="m">T<b> 6</b></span><span class="m">D<b> 3</b></span><span class="when">prima di negoziare</span></div></div>
      <div class="book"><div class="h"><span class="ttl">Influence</span><span class="by">Robert Cialdini</span></div><div class="desc">I sei principi della persuasione: usali, e riconoscili quando li usano su di te.</div><div class="metrics"><span class="m">P<b> 8</b></span><span class="m">T<b> 6</b></span><span class="m">D<b> 4</b></span><span class="when">presto</span></div></div>
    </div>

    <!-- F -->
    <div class="cat">
      <div class="cathead"><div class="badge">F</div><h3>Creatività, caos, mente ENTP</h3><div class="tag">trasformare idee in output · chiudere</div></div>
      <div class="book"><div class="h"><span class="ttl">The War of Art</span><span class="by">Steven Pressfield</span></div><div class="desc">Dà un nome alla "Resistenza" che ti fa non chiudere. Corto e brutale.</div><div class="metrics"><span class="m">P<b> 7</b></span><span class="m">T<b> 8</b></span><span class="m">D<b> 2</b></span><span class="when">subito</span></div></div>
      <div class="book"><div class="h"><span class="ttl">The Dip</span><span class="by">Seth Godin</span><span class="new">nuovo</span></div><div class="desc">Il criterio per distinguere l'abbandono strategico dalla fase dura prima del risultato. Due ore.</div><div class="metrics"><span class="m">P<b> 9</b></span><span class="m">T<b> 6</b></span><span class="m">D<b> 2</b></span><span class="when">Fase 1</span></div></div>
      <div class="book"><div class="h"><span class="ttl">Getting Things Done</span><span class="by">David Allen</span></div><div class="desc">La cattura che svuota la testa dai loop aperti (effetto Zeigarnik).</div><div class="metrics"><span class="m">P<b> 9</b></span><span class="m">T<b> 6</b></span><span class="m">D<b> 4</b></span><span class="when">presto</span></div></div>
      <div class="book"><div class="h"><span class="ttl">Finish</span><span class="by">Jon Acuff</span></div><div class="desc">Completare davvero: contro il perfezionismo e il tutto-o-niente che ti fa mollare all'80%.</div><div class="metrics"><span class="m">P<b> 8</b></span><span class="m">T<b> 6</b></span><span class="m">D<b> 3</b></span><span class="when">presto</span></div></div>
    </div>

    <!-- G -->
    <div class="cat">
      <div class="cathead"><div class="badge">G</div><h3>Scomodi ma necessari</h3><div class="tag">colpiscono i punti ciechi</div></div>
      <div class="book"><div class="h"><span class="ttl">On the Shortness of Life</span><span class="by">Seneca</span></div><div class="desc">Specchio spietato sul tempo sprecato e la distrazione. È corto: nessuna scusa.</div><div class="metrics"><span class="m">P<b> 5</b></span><span class="m">T<b> 8</b></span><span class="m">D<b> 5</b></span><span class="when">presto</span></div></div>
      <div class="book"><div class="h"><span class="ttl">Twilight of the Idols / Ecce Homo</span><span class="by">Friedrich Nietzsche</span></div><div class="desc">Auto-superamento e creare i propri valori: smetti di appaltare il tuo valore agli altri. Versione seria, non da palestra.</div><div class="metrics"><span class="m">P<b> 3</b></span><span class="m">T<b> 9</b></span><span class="m">D<b> 9</b></span><span class="when">quando sei pronto</span></div></div>
      <div class="book"><div class="h"><span class="ttl">Maps of Meaning</span><span class="by">Jordan Peterson</span><span class="new">nuovo</span></div><div class="desc">Il Peterson profondo: junghiano, mitologico, densissimo. Solo se vuoi scavare fino in fondo.</div><div class="metrics"><span class="m">P<b> 3</b></span><span class="m">T<b> 9</b></span><span class="m">D<b> 10</b></span><span class="when">hard mode</span></div></div>
    </div>
  </section>

  <section id="roadmap">
    <div class="eyebrow">Il percorso</div>
    <h2>Roadmap 6 mesi</h2>
    <div class="sub" style="margin-bottom:24px">Non leggere tutti e 36 in 6 mesi: è dispersione travestita da ambizione. Questo è lo spina dorsale da 2 libri al mese; gli <span style="color:var(--ice)">innesti</span> sono le aggiunte da incastrare nella fase giusta.</div>
    <div class="road">
      <div class="mo"><div><div class="when2">Mese 1</div><div class="ph">Stabilizzazione</div></div><div><div class="bk">Atomic Habits · Dopamine Nation</div><div class="ino">Installa il sistema base e taglia le falle di dopamina.</div></div></div>
      <div class="mo"><div><div class="when2">Mese 2</div><div class="ph">Esecuzione</div></div><div><div class="bk">The War of Art · Indistractable</div><div class="ino">Chiudi e proteggi l'attenzione. <span>Innesti:</span> The Dip (extra veloce) · Building a Second Brain quando monti il Notion.</div></div></div>
      <div class="mo"><div><div class="when2">Mese 3</div><div class="ph">Comprensione di sé</div></div><div><div class="bk">Man's Search for Meaning · Attached</div><div class="ino">Carburante-significato + la chiave dell'attaccamento.</div></div></div>
      <div class="mo"><div><div class="when2">Mese 4</div><div class="ph">Sé e lucidità</div></div><div><div class="bk">No More Mr. Nice Guy · A Guide to the Good Life</div><div class="ino">Pattern di validazione + motore emotivo da tempo di pace. <span>Innesto:</span> 12 Rules for Life.</div></div></div>
      <div class="mo"><div><div class="when2">Mese 5</div><div class="ph">Strategia e persone</div></div><div><div class="bk">The Laws of Human Nature · Good Strategy Bad Strategy</div><div class="ino">Leggi le persone + scrivi una strategia vera. <span>Innesto:</span> Games People Play.</div></div></div>
      <div class="mo"><div><div class="when2">Mese 6</div><div class="ph">Carriera e leverage</div></div><div><div class="bk">So Good They Can't Ignore You · The Almanack of Naval Ravikant</div><div class="ino">Career capital + leverage. <span>Poi:</span> Never Split the Difference prima della prossima negoziazione.</div></div></div>
    </div>
    <div class="ph5"><b>Fase 5 — Espansione (mesi 7+):</b> Mastery, Mating in Captivity, Models, Influence, Thinking Fast and Slow, The Charisma Myth, Finish, Getting Things Done (completo), Seneca, Nietzsche, The Body Keeps the Score (quando sei stabile), The 48 Laws of Power (lente), The Value of Others (lente), Maps of Meaning (hard).</div>
  </section>

  <section id="modes">
    <div class="eyebrow">Tre tagli della stessa libreria</div>
    <h2>Per come ti senti</h2>
    <div class="sub" style="margin-bottom:24px">Stessi libri, tre punti d'ingresso a seconda di cosa ti serve in quel momento.</div>
    <div class="modes">
      <div class="mode"><h4>Hard mode</h4><div class="mt">Difficili ma potentissimi</div><ul>
        <li><b>Thinking, Fast and Slow</b> — Kahneman</li>
        <li><b>The Body Keeps the Score</b> — van der Kolk</li>
        <li><b>Marco Aurelio &amp; Seneca</b> — le fonti stoiche</li>
        <li><b>The Laws of Human Nature</b> — Greene</li>
        <li><b>Nietzsche</b> — auto-superamento</li>
        <li><b>Maps of Meaning</b> — Peterson</li>
      </ul></div>
      <div class="mode"><h4>Practical mode</h4><div class="mt">Applicabili da subito</div><ul>
        <li><b>Atomic Habits</b></li>
        <li><b>Indistractable</b></li>
        <li><b>The One Thing</b></li>
        <li><b>Never Split the Difference</b></li>
        <li><b>Getting Things Done</b></li>
        <li><b>Building a Second Brain</b></li>
        <li><b>So Good They Can't Ignore You</b></li>
        <li><b>The Dip · Finish · Charisma Myth</b></li>
      </ul></div>
      <div class="mode"><h4>Relazioni / emozioni</h4><div class="mt">Capire te stesso e gli altri</div><ul>
        <li><b>Attached</b></li>
        <li><b>Models</b></li>
        <li><b>No More Mr. Nice Guy</b></li>
        <li><b>Mating in Captivity</b></li>
        <li><b>Nonviolent Communication</b></li>
        <li><b>The Laws of Human Nature</b></li>
        <li><b>Games People Play</b></li>
        <li><b>The Value of Others</b> <span style="color:var(--faint)">(lente)</span></li>
      </ul></div>
    </div>
  </section>

  <section id="evitare">
    <div class="eyebrow">Filtri</div>
    <h2>Da evitare per ora</h2>
    <div class="sub" style="margin-bottom:22px">Anche se famosi. Ognuno con il motivo vero.</div>
    <div class="avoid">
      <div class="ai"><b>Can't Hurt Me</b> (Goggins) — glorifica il dolore come carburante: esattamente il pattern che stai superando.</div>
      <div class="ai"><b>Manosphere / redpill duro</b> (es. The Rational Male) — visione cinica e transazionale che aumenta cinismo e fame di validazione.</div>
      <div class="ai"><b>The Game</b> (Strauss) come manuale — Models copre lo stesso terreno in modo onesto e migliore.</div>
      <div class="ai"><b>The Slight Edge</b> — motivazionale-sottile, già coperto meglio da Atomic Habits + Naval.</div>
      <div class="ai"><b>The Millionaire Fastlane</b> — registro hype, e la tesi anti-risparmio confligge col tuo temperamento (RS3 coi risparmi, Svizzera sotto le tue possibilità).</div>
      <div class="ai"><b>Zero to One · Being Mortal</b> — ottimi libri, fuori target: startup e fine-vita non sono i tuoi obiettivi.</div>
      <div class="ai"><b>Range</b> — ti valida la dispersione invece di curarla. Semmai in Fase 5, non prima.</div>
      <div class="ai"><b>Guru motivazionali generici</b> — conforto e hype, non trasformazione.</div>
      <div class="ai"><b>48 Laws / The Value of Others letti come vangelo</b> — solo come lente, mai come sistema operativo.</div>
    </div>
  </section>

  <section id="come">
    <div class="eyebrow">Il metodo</div>
    <h2>Come leggerli</h2>
    <div class="sub" style="margin-bottom:24px">Leggere libri sulla disciplina senza applicarli è solo un'altra forma di dopamina facile: dà la sensazione del progresso senza il progresso.</div>
    <div class="read">
      <div class="ri"><div></div><p><b>Penna in mano.</b> Per ogni libro, una nota sola: <i>cosa cambio lunedì</i>. Una cosa concreta, non dieci.</p></div>
      <div class="ri"><div></div><p><b>Un sistema per volta.</b> Cattura → deep work → finishing. In ordine. Non installare tre rituali insieme.</p></div>
      <div class="ri"><div></div><p><b>Profondità, non velocità.</b> Meglio 12 libri applicati che 36 letti. Il numero alto è la trappola ENTP, non la soluzione.</p></div>
    </div>
  </section>

  <footer>
    Il pezzo sonno/energia — rilevante per la tua costanza in palestra e dieta — non è nelle schede per non gonfiare la lista. Se lo vuoi: <b>Why We Sleep</b> di Matthew Walker è il riferimento serio.
  </footer>

</div>`;

export default function AdminArsenalePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ARSENALE_CSS }} />
      <div
        className="arsenale-root"
        dangerouslySetInnerHTML={{ __html: ARSENALE_HTML }}
      />
    </>
  );
}
