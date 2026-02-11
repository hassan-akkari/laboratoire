export default function NextSteps() {
  return (
    <section className="rounded-2xl border border-[--app-border] bg-[--app-card] p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Next steps</h2>
      <ol className="mt-3 list-decimal pl-4 text-sm text-[--app-muted]">
        <li>Importa i componenti Tailwind Plus in `src/components`.</li>
        <li>Decidi palette brand definitiva (tokens + HeroUI).</li>
        <li>Aggiungi pagine reali e routing.</li>
      </ol>
    </section>
  );
}
