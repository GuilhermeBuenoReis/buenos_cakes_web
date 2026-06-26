import Link from "next/link";
import { SignupForm } from "./_components/signup-form";

export default function SignupPage() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Link
					href="/dashboard"
					className="flex items-center gap-2 self-center font-medium"
				>
					<div className="text-3xl leading-none font-bold tracking-tight">
						<span className="text-[#1f2937]">Doce</span>
						<span className="text-[#ff4b61]">Gestão</span>
					</div>
				</Link>
				<SignupForm />
			</div>
		</div>
	);
}
