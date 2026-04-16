import { type ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { clearAdminToken, getAdminMe, getSavedAdminToken } from '../../api/admin'

type AdminRouteGateProps = {
  children: ReactNode
}

function AdminRouteGate({ children }: AdminRouteGateProps) {
  const [isChecking, setIsChecking] = useState(true)
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function verifySession() {
      const token = getSavedAdminToken()
      if (!token) {
        if (isMounted) {
          setIsAllowed(false)
          setIsChecking(false)
        }
        return
      }

      try {
        await getAdminMe(token)
        if (isMounted) {
          setIsAllowed(true)
        }
      } catch {
        clearAdminToken()
        if (isMounted) {
          setIsAllowed(false)
        }
      } finally {
        if (isMounted) {
          setIsChecking(false)
        }
      }
    }

    void verifySession()

    return () => {
      isMounted = false
    }
  }, [])

  if (isChecking) {
    return (
      <main className="min-h-screen bg-[#ebebdd] px-4 py-10 text-[#151515] sm:px-6">
        <div className="mx-auto max-w-[780px] border-2 border-[#111111] bg-[#f8f6ef] p-6 shadow-[5px_5px_0_#9f9f9f]">
          <h1 className="font-['Syne'] text-[clamp(24px,4vw,40px)]">Verifying Admin Session...</h1>
        </div>
      </main>
    )
  }

  if (!isAllowed) {
    return <Navigate to="/v3/admin/login-page" replace />
  }

  return <>{children}</>
}

export default AdminRouteGate
