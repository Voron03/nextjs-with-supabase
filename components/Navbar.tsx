'use client'

import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { LogoutButton } from './logout-button'

export default function Navbar() {
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user)
        })

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null)
            }
        )

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
    }

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md">
            <div className="flex items-center justify-between px-8 py-4">

                <div className="font-bold text-xl">
                    CESIZen
                </div>

                <div className="flex gap-6 items-center text-sm">

                    <Link href="/">Accueil</Link>
                    <Link href="/exercices">Exercices</Link>
                    <Link href="/protected/profile">Profile</Link>

                    {user ? (
                        <LogoutButton />

                    ) : (
                        <>
                            <Link href="/auth/login" className="text-emerald-600">
                                Se connecter
                            </Link>

                            <Link href="/auth/sign-up" className="text-blue-600">
                                S'inscrire
                            </Link>
                        </>
                    )}

                </div>
            </div>
        </nav>
    )
}
