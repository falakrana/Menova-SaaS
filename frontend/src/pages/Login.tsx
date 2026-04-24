import { SignIn } from "@clerk/react";
import { UtensilsCrossed } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left branding panel */}
      <div className="hidden lg:flex w-1/2 items-center justify-center border-r border-border bg-muted/40 p-12">
        <div className="max-w-md">
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background">
            <UtensilsCrossed className="w-6 h-6 text-primary-foreground" />
          </div>
          <h2 className="mb-4 font-display text-4xl font-semibold text-foreground">
            Welcome back to Menova
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Manage your menu, track engagement, and keep service smooth with one
            clean workflow.
          </p>
        </div>
      </div>

      {/* Right panel — Clerk SignIn */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="lg:hidden flex items-center gap-2.5 absolute top-6 left-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background">
            <UtensilsCrossed className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold text-xl">Menova</span>
        </div>

        <SignIn
          routing="hash"
          signUpUrl="/register"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "w-full max-w-sm",
              card: "rounded-[1.75rem] border border-border bg-card shadow-md p-7",
              headerTitle: "font-display text-3xl font-semibold",
              headerSubtitle: "text-muted-foreground text-sm",
              socialButtonsBlockButton:
                "border border-border bg-background hover:bg-muted text-foreground font-medium rounded-xl",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground text-xs",
              formFieldLabel: "text-sm font-medium text-foreground",
              formFieldInput:
                "border border-input bg-background rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary",
              formButtonPrimary:
                "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg w-full",
              footerActionLink: "text-primary font-medium hover:underline",
              identityPreviewEditButton: "text-primary",
            },
          }}
        />
      </div>
    </div>
  );
}
