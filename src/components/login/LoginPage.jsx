import LeftLogin from "./componentsLogin/LeftLogin"
import SignIn from "./signIn/SignIn"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LeftLogin />
      <SignIn />
    </div>
  )
}

