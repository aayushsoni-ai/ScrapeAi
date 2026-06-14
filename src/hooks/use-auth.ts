"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInData = z.infer<typeof signInSchema>;
type SignUpData = z.infer<typeof signUpSchema>;

export const useAuth = () => {
  const { signIn, signOut } = useAuthActions();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleSignIn = signInForm.handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      await signIn("password", { ...data, flow: "signIn" });
      router.push("/dashboard");
    }
    catch(error){
        signInForm.setError('password',{
            message: 'Invalid email password',
        })
    }
     finally {
      setIsLoading(false);
    }
  });

  const handleSignUp = signUpForm.handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      await signIn("password", { ...data, flow: "signUp" });
      router.push("/dashboard");
    }catch(error){
        signUpForm.setError('root',{
            message: 'Failed to create account. Email may already exist',
        })}
         finally {
      setIsLoading(false);
    }
  });

  const handleSignOut = async () => {
    try {
        await signOut()
        router.push('/auth/sign-in')
    } catch (error) {
        console.error("SignOut error !!", error)
    }
  }

  return {
    signInForm,
    signUpForm,
    handleSignIn,
    handleSignUp,
    handleSignOut,
    isLoading,
  };
};
