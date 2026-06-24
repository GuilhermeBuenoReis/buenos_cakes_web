import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProfileSheetFieldProps extends PropsWithChildren {
	className?: string;
	error?: string;
	hint?: ReactNode;
	htmlFor: string;
	label: string;
}

export function ProfileSheetField({
	children,
	className,
	error,
	hint,
	htmlFor,
	label,
}: ProfileSheetFieldProps) {
	return (
		<div className={cn("space-y-1.5", className)}>
			<label
				htmlFor={htmlFor}
				className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase"
			>
				{label}
			</label>
			{children}
			{hint ? <p className="text-[11px] text-slate-400">{hint}</p> : null}
			{error ? <p className="text-[11px] text-rose-500">{error}</p> : null}
		</div>
	);
}
