"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { type CreateUserRequestInput, createUser } from "@/api/backend/auth";
import { getBackendErrorMessage } from "@/api/backend/errors";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const signUpSchema = z
	.object({
		confirmPassword: z.string().trim().min(1, "Confirme sua senha."),
		email: z.email("Informe um e-mail válido."),
		name: z
			.string()
			.trim()
			.min(1, "Informe seu nome completo.")
			.refine((value) => value.split(/\s+/).length >= 2, {
				message: "Digite nome e sobrenome.",
			}),
		password: z
			.string()
			.trim()
			.min(8, "A senha deve ter pelo menos 8 caracteres."),
	})
	.superRefine((values, context) => {
		if (values.password !== values.confirmPassword) {
			context.addIssue({
				code: "custom",
				message: "As senhas não coincidem.",
				path: ["confirmPassword"],
			});
		}
	});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const defaultSignUpFormValues: SignUpFormValues = {
	confirmPassword: "",
	email: "",
	name: "",
	password: "",
};

export function SignupForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const {
		formState: { errors },
		handleSubmit,
		register,
		reset,
	} = useForm<SignUpFormValues>({
		defaultValues: defaultSignUpFormValues,
		mode: "onBlur",
		reValidateMode: "onChange",
		resolver: zodResolver(signUpSchema),
	});

	const signUpMutation = useMutation({
		mutationFn: (values: CreateUserRequestInput) => createUser(values),
		onSuccess: () => {
			reset(defaultSignUpFormValues);
			router.push("/sign-in");
		},
	});

	const signUpError = signUpMutation.isError
		? getBackendErrorMessage(
				signUpMutation.error,
				"Não foi possível criar sua conta agora. Tente novamente.",
			)
		: null;

	function handleSignUpSubmit(values: SignUpFormValues) {
		signUpMutation.mutate({
			email: values.email,
			name: values.name,
			password: values.password,
		});
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Crie sua conta</CardTitle>
					<CardDescription>
						Preencha os dados abaixo para criar sua conta
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form noValidate onSubmit={handleSubmit(handleSignUpSubmit)}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="name">Nome completo</FieldLabel>
								<Input
									aria-invalid={Boolean(errors.name)}
									autoComplete="name"
									id="name"
									placeholder="João da Silva"
									type="text"
									{...register("name")}
									required
								/>
								<FieldError errors={[errors.name]} />
							</Field>
							<Field>
								<FieldLabel htmlFor="email">E-mail</FieldLabel>
								<Input
									aria-invalid={Boolean(errors.email)}
									autoComplete="email"
									id="email"
									placeholder="voce@exemplo.com"
									type="email"
									{...register("email")}
									required
								/>
								<FieldDescription>
									Usaremos este e-mail para entrar em contato com você. Não
									compartilharemos seu e-mail com terceiros.
								</FieldDescription>
								<FieldError errors={[errors.email]} />
							</Field>
							<Field>
								<FieldLabel htmlFor="password">Senha</FieldLabel>
								<Input
									aria-invalid={Boolean(errors.password)}
									autoComplete="new-password"
									id="password"
									type="password"
									{...register("password")}
									required
								/>
								<FieldDescription>
									Deve ter pelo menos 8 caracteres.
								</FieldDescription>
								<FieldError errors={[errors.password]} />
							</Field>
							<Field>
								<FieldLabel htmlFor="confirm-password">
									Confirmar senha
								</FieldLabel>
								<Input
									aria-invalid={Boolean(errors.confirmPassword)}
									autoComplete="new-password"
									id="confirm-password"
									type="password"
									{...register("confirmPassword")}
									required
								/>
								<FieldDescription>Confirme sua senha.</FieldDescription>
								<FieldError errors={[errors.confirmPassword]} />
							</Field>
							<Field>
								<Button disabled={signUpMutation.isPending} type="submit">
									{signUpMutation.isPending ? "Criando conta..." : "Criar conta"}
								</Button>
								{signUpError ? (
									<FieldError errors={[{ message: signUpError }]} />
								) : null}
								<FieldDescription className="text-center">
									Já tem uma conta? <Link href="/sign-in">Entrar</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
			<FieldDescription className="px-6 text-center">
				Ao continuar, você concorda com nossos{" "}
				<Link href="#">Termos de Serviço</Link> e{" "}
				<Link href="#">Política de Privacidade</Link>.
			</FieldDescription>
		</div>
	);
}
