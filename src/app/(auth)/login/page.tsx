import { AuthLayout } from "@/features/auth/ui/components/auth-layout";
import { LoginForm } from "@/features/auth/ui/components/login-form";
import { requireUnauth } from "@/lib/auth-utils";

export default async function Page() {
    await requireUnauth();
    

    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
}