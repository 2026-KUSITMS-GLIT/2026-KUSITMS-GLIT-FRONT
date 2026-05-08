type GuidanceVariant = "default" | "drop";

interface GuidanceProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  variant?: GuidanceVariant;
}

const Guidance = ({ variant = "default", children, className, ...props }: GuidanceProps) => {
  return (
    <div data-variant={variant} className={className} {...props}>
      <div className="py-1">
        <p className="body-3 text-sea-blue-400 w-fit cursor-pointer text-left underline underline-offset-4">
          {children}
        </p>
      </div>
    </div>
  );
};

export default Guidance;
