import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleAuthButton from "./GoogleAuthButton";

export default function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-6  w-full max-w-sm", className)}
      {...props}
    >
      <Card className="bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-gray-100">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Signup with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <GoogleAuthButton>Signup with Google</GoogleAuthButton>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-gray-300 dark:after:border-gray-600">
                <span className="relative z-10 bg-white dark:bg-[#1C1C1E] px-2 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className="text-[#1C1C1E] dark:text-gray-300"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    className="bg-gray-50 dark:bg-[#1C1C1E] text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label
                      htmlFor="password"
                      className="text-[#1C1C1E] dark:text-gray-300"
                    >
                      Password
                    </Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="bg-gray-50 dark:bg-[#1C1C1E] text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-500 dark:bg-blue-700 text-white hover:bg-blue-600 dark:hover:bg-blue-800"
                >
                  Signup
                </Button>
              </div>
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to={"/login"}
                  className="underline underline-offset-4 text-blue-500 dark:text-blue-400"
                >
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
