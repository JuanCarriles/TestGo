import { PortableText } from '@portabletext/react';
import type { PortableTextComponents } from '@portabletext/react';
import { getImageUrl } from '../../lib/images';

const components: PortableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref && !value?.asset?.url) return null;
      return (
        <figure className="my-8 w-full">
          <img
            src={value.asset.url ? value.asset.url : getImageUrl(value.asset._ref)}
            alt={value.alt || 'Imagen de noticia'}
            className="w-full h-auto rounded-2xl shadow-lg object-cover"
            loading="lazy"
          />
        </figure>
      );
    },
  },
  block: {
    h1: ({ children }) => <h1 className="text-4xl md:text-5xl font-bold text-text font-display mt-10 mb-6">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl md:text-4xl font-bold text-text font-display mt-10 mb-6">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl md:text-3xl font-bold text-text font-display mt-8 mb-4">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl md:text-2xl font-bold text-text font-display mt-6 mb-4">{children}</h4>,
    normal: ({ children }) => <p className="text-base md:text-lg text-text/70 font-body leading-relaxed mb-6">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-6 my-8 italic text-lg md:text-xl text-text/80 font-body bg-surface/5 py-4 pr-4 rounded-r-xl">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-base md:text-lg text-text/70 font-body">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-base md:text-lg text-text/70 font-body">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-2">{children}</li>,
    number: ({ children }) => <li className="pl-2">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
      return (
        <a href={value.href} rel={rel} className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors">
          {children}
        </a>
      );
    },
  },
};

interface Props {
  content: any[];
}

export default function PortableTextRenderer({ content }: Props) {
  if (!content || !Array.isArray(content) || content.length === 0) return null;
  return <PortableText value={content} components={components} />;
}
