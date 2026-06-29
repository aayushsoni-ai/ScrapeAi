'use client'
import { LogoIcon } from '@/components/logo'
import Google from '@/components/button/oauth/google' 
import Microsoft from '@/components/button/oauth/microsoft' 
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
    const { signUpForm, handleSignUp, isLoading } = useAuth()
    const { register, formState: { errors } } = signUpForm

    return (
        <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
            <form
                onSubmit={handleSignUp}
                className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
                <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
                    <div className="text-center">
                        <Link
                            href="/"
                            aria-label="go home"
                            className="mx-auto block w-fit">
                            <LogoIcon />
                        </Link>
                        <h1 className="mb-1 mt-4 text-xl font-semibold">Create a ScrapeAi Account</h1>
                        <p className="text-sm">Welcome! Create an account to get started</p>
                    </div>

                    <div className="mt-6 space-y-6">

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
                            {errors.email && (
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
                                id="pwd"
                                {...register('password')}
                                className={errors.password ? 'border-destructive' : ''}
                            />
                            {errors.password && (
                                <p className='text-xs text-destructive'>{errors.password?.message}</p>
                            )}
                        </div>

                        {errors.root && (
                            <div className='rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-center'>
                                <p className='text-xs text-destructive'>{errors.root.message}</p>
                                {errors.root.message?.includes('sign in') && (
                                    <Link href="/auth/sign-in" className='mt-1 inline-block text-xs font-medium text-primary underline underline-offset-2 hover:opacity-80 transition'>
                                        Go to Sign In →
                                    </Link>
                                )}
                            </div>
                        )}

                        <Button type='submit' disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />Signing Up...
                                </>
                            ) : ('Sign Up')}
                        </Button>
                    </div>

                    <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                        <hr className="border-dashed" />
                        <span className="text-muted-foreground text-xs">Or continue With</span>
                        <hr className="border-dashed" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       <Google/>
                       <Microsoft/>
                    </div>
                </div> 

                <div className="p-3">
                    <p className="text-accent-foreground text-center text-sm">
                        Have an account ?
                        <Button
                            variant="link"
                            className="px-2"
                            nativeButton={false}
                            render={<Link href="/auth/sign-in">Sign In</Link>}
                        />
                    </p>
                </div>
            </form>
        </section>
    )
}