interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mb-12 text-center">
      <p className="landing-eyebrow">{eyebrow}</p>
      <h2 className="landing-section-title mt-4">{title}</h2>
      {description && (
        <p className="landing-body mx-auto mt-5 max-w-2xl">{description}</p>
      )}
    </div>
  );
}
