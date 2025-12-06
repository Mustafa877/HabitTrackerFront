"use client"

import { useState } from "react"
import { GoogleLogin } from "@react-oauth/google"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"
import { api } from "@/lib/api"
import { motion } from "framer-motion"

interface AuthFormProps {
    onSuccess: (token: string, user: unknown) => void
    lang: "en" | "ar"
}

const translations = {
    en: {
        loginTitle: "Welcome Back",
        signupTitle: "Create Account",
        loginDesc: "Enter your credentials to access your habits.",
        signupDesc: "Start your journey to better habits today.",
        fullName: "Full Name",
        email: "Email",
        password: "Password",
        loginButton: "Sign In",
        signupButton: "Sign Up",
        loading: "Please wait...",
        noAccount: "Don't have an account? Sign Up",
        hasAccount: "Already have an account? Sign In",
        or: "Or continue with",
        googleLoginFailed: "Google Login Failed",
        welcomeBack: "Welcome back!",
        accountCreated: "Account created! Please login."
    },
    ar: {
        loginTitle: "مرحباً بعودتك",
        signupTitle: "إنشاء حساب",
        loginDesc: "أدخل بيانات اعتمادك للوصول إلى عاداتك.",
        signupDesc: "ابدأ رحلتك نحو عادات أفضل اليوم.",
        fullName: "الاسم الكامل",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        loginButton: "تسجيل الدخول",
        signupButton: "إنشاء حساب",
        loading: "يرجى الانتظار...",
        noAccount: "ليس لديك حساب؟ إنشاء حساب",
        hasAccount: "لديك حساب بالفعل؟ تسجيل الدخول",
        or: "أو المتابعة باستخدام",
        googleLoginFailed: "فشل تسجيل الدخول عبر Google",
        welcomeBack: "مرحباً بعودتك!",
        accountCreated: "تم إنشاء الحساب! يرجى تسجيل الدخول."
    }
}

export function AuthForm({ onSuccess, lang = "en" }: AuthFormProps) {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [loading, setLoading] = useState(false)

    const t = translations[lang]
    const isRtl = lang === "ar"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (isLogin) {
                const data = await api.post("/auth/login", { email, password })
                onSuccess(data.token, data.user)
                toast.success(t.welcomeBack)
            } else {
                await api.post("/auth/register", { email, password, fullName })
                toast.success(t.accountCreated)
                setIsLogin(true)
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("An error occurred")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            <Card className="w-full backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {isLogin ? t.loginTitle : t.signupTitle}
                    </CardTitle>
                    {/* <CardDescription className="text-center">
                        {isLogin ? t.loginDesc : t.signupDesc}
                    </CardDescription> */}
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} dir={isRtl ? "rtl" : "ltr"}>
                        <div className="grid w-full items-center gap-4">
                            {!isLogin && (
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="fullname">{t.fullName}</Label>
                                    <Input
                                        id="fullname"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required={!isLogin}
                                        className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                                    />
                                </div>
                            )}
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">{t.email}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">{t.password}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex flex-col gap-4">
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                                disabled={loading}
                            >
                                {loading ? t.loading : (isLogin ? t.loginButton : t.signupButton)}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">{t.or}</span>
                                </div>
                            </div>

                            <div className="flex justify-center w-full">
                                <GoogleLogin
                                    onSuccess={async (credentialResponse) => {
                                        try {
                                            const data = await api.post("/auth/google-login", { idToken: credentialResponse.credential })
                                            onSuccess(data.token, data.user)
                                            toast.success(t.welcomeBack)
                                        } catch (error) {
                                            if (error instanceof Error) {
                                                toast.error(error.message)
                                            } else {
                                                toast.error("Google login failed")
                                            }
                                        }
                                    }}
                                    onError={() => {
                                        toast.error(t.googleLoginFailed)
                                    }}
                                    locale={lang}
                                    shape="circle"
                                    width="100%"
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center pb-6">
                    <Button
                        variant="link"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-gray-500 hover:text-purple-600 transition-colors duration-200"
                    >
                        {isLogin ? t.noAccount : t.hasAccount}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
