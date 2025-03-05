export default function BackgroundLogin() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"></div>
      <img src="/login/login.jpg" alt="Fitness motivation" className="object-cover w-full h-full" />
    </div>
  )
}

