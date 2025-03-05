import BackgroundLogin from "./componentsLogin/BackgroundLogin"
import SignIn from "./signIn/SignIn"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <BackgroundLogin />
      <SignIn />
    </div>
  )
}