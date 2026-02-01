export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex-col gap-4 py-8 text-center md:flex-row md:justify-between md:py-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} FlavorVerse. All rights reserved.
        </p>
        <p className="text-sm text-muted-foreground">
          Built with love for good food.
        </p>
      </div>
    </footer>
  );
}
