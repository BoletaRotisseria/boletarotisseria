import type { Noticia } from "@/lib/noticias";

export function NoticiasGrid({ noticias }: { noticias: Noticia[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {noticias.map((item, i) => (
        <a
          key={i}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-background rounded-2xl border border-border/50 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
        >
          <div className="w-full h-40 rounded-xl overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
              style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
              loading="lazy"
            />
          </div>
          <div className="flex flex-col justify-between flex-1 min-w-0">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  {item.source}
                </span>
                {item.isNew && (
                  <span className="text-[9px] font-bold tracking-wider uppercase bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded-full">
                    Novo
                  </span>
                )}
              </div>
              <h3 className="font-serif normal-case text-base font-bold mb-1.5 leading-snug group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">{item.excerpt}</p>
            </div>
            <span className="mt-3 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              Vem ler tudo aqui →
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
