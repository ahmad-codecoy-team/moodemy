"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { FirebaseClientAuth } from "@/lib/firebase-client";

export default function LoginPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    email: "moodymecct2025@gmail.com",
    password: "admin@moodemy.com",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Step 1: Authenticate with Firebase Client SDK
      const { idToken } = await FirebaseClientAuth.signIn(
        formData.email,
        formData.password
      );

      // Step 2: Verify admin role and create session via our API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          idToken: idToken,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Admin session created successfully
        router.push("/admin");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Sign In</h1>
            <p className="text-muted-foreground">
              Enter your email and password to sign in!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="info@gmail.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-12" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-sidebar relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="absolute bottom-8 right-8 rounded-full"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        <div className="text-center space-y-6">
          <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center mx-auto">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-10 bg-white rounded-full"></div>
              <div className="w-2.5 h-14 bg-white rounded-full"></div>
              <div className="w-2.5 h-12 bg-white rounded-full"></div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-sidebar-foreground mb-2">
              MoodyMe Admin Dashboard
            </h2>
            <p className="text-sidebar-foreground/60 text-lg">
              Manage your MoodyMe application
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
