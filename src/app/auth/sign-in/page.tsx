'use client'
import { LogoIcon } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'
import { Loader2 } from "lucide-react";
import Google from '@/components/button/oauth/google'
import Microsoft from '@/components/button/oauth/microsoft' 
export default function LoginPage() {

   
   const {signInForm, handleSignIn,isLoading} =  useAuth()
   const {register, formState: {errors} ,} = signInForm

    return (
        <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
            <form
                onSubmit={handleSignIn}
                className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
                <div className="p-8 pb-6">
                    <div>
                        <Link
                            href="/"
                            aria-label="go home">
                            <LogoIcon />
                        </Link>
                        <h1 className="mb-1 mt-4 text-xl font-semibold">Sign In to ScrapeAi</h1>
                        <p className="text-sm">Welcome back! Sign in to continue</p>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <Google/>
                       <Microsoft/>
                    </div>

                    <hr className="my-4 border-dashed" />

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="block text-sm">
                                Username
                            </Label>
                            <Input
                                type="email"
                                id="email"
                                {...register('email')}
                                className={errors.email ? 'border-destructive' : ''}
                            />
                           { errors.email && (
                                <p className='text-xs text-destructive'>{errors.email?.message}</p>
                            )}
                        </div>

                        <div className="space-y-0.5">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="pwd"
                                    className="text-sm">
                                    Password
                                </Label>
                                <Button
                                    variant="link"
                                    size="sm"
                                    nativeButton={false}
                                    render={
                                        <Link
                                            href="#"
                                            className="link intent-info variant-ghost text-sm">
                                            Forgot your Password ?
                                        </Link>
                                    }
                                />
                            </div>
                            <Input
                                type="password"
                                id="password"
                                {...register('password')}
                                className={errors.password ? 'border-destructive' : ''}
                            />
                           { errors.password && (
                                <p className='text-xs text-destructive'>{errors.password?.message}</p>
                            )}
                        </div>
                        {
                            errors.root && (
                                <div className='rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-center'>
                                    <p className='text-xs text-destructive'>{errors.root.message}</p>
                                    {errors.root.message?.includes('sign up') && (
                                        <Link href="/auth/sign-up" className='mt-1 inline-block text-xs font-medium text-primary underline underline-offset-2 hover:opacity-80 transition'>
                                            Go to Sign Up →
                                        </Link>
                                    )}
                                </div>
                            )
                        }

                        <Button type='submit' disabled={isLoading} className="w-full">
                            {
                                isLoading ? (
                                    <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin'/>Signing In...
                                    </>
                                ) : ('Sign In')
                            }
                        </Button>
                    </div>
                </div>

                <div className="bg-muted rounded-(--radius) border p-3">
                    <p className="text-accent-foreground text-center text-sm">
                        Don't have an account ?
                        <Button
                            variant="link"
                            className="px-2"
                            nativeButton={false}
                            render={<Link href="/auth/sign-up">Create account</Link>}
                        />
                    </p>
                </div>
            </form>
        </section>
    )
}