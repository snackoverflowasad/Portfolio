import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin, saveAdminToken } from "../../api/admin";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@portfolio.dev");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Email and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const result = await loginAdmin(email.trim(), password);
      saveAdminToken(result.accessToken);

      navigate("/v4/admin/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to login.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#ebebdd] px-4 py-8 text-[#151515] sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[980px] gap-6 lg:grid-cols-[1fr_1.15fr]">
        <section className="border-2 border-[#111111] bg-[#f7f4e6] p-6 shadow-[5px_5px_0_#9f9f9f] sm:p-8">
          <p className="mb-3 inline-block border-2 border-[#111111] bg-[#f5d44f] px-3 py-1 font-['Syne'] text-xs font-extrabold uppercase tracking-[0.14em]">
            Admin Access
          </p>
          <h1 className="mb-4 font-['Syne'] text-[clamp(30px,5.8vw,58px)] leading-[0.95] tracking-[-0.03em]">
            Portfolio Control Room
          </h1>
          <p className="m-0 max-w-[36ch] text-[16px] leading-[1.6] text-[#3f3f3f]">
            a pure fechang just to showcase my skills and potential to the
            world. Flexing my technical powers and creativity.....koi nazar na
            lagey! apni jealousy ko Airplane Mode pe rakhna cause you don't
            belong to this page (admin page nhi dikh rha kya??)
          </p>
          <div className="mt-6 border-t-2 border-[#111111] pt-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center border-2 border-[#111111] bg-white px-4 py-2 font-['Syne'] text-xs font-bold uppercase tracking-[0.14em] text-[#111111] no-underline shadow-[3px_3px_0_#111111] transition hover:-translate-y-px"
            >
              Back To Site
            </Link>
          </div>
        </section>

        <section className="border-2 border-[#111111] bg-white p-6 shadow-[5px_5px_0_#9f9f9f] sm:p-8">
          <h2 className="mb-5 font-['Syne'] text-[30px] leading-none">Login</h2>

          {errorMessage ? (
            <p className="mb-4 border-2 border-[#111111] bg-[#ffd9d9] px-4 py-3 font-['Syne'] text-[13px] font-bold text-[#8f1d1d]">
              {errorMessage}
            </p>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-1.5 block font-['Syne'] text-xs font-extrabold uppercase tracking-[0.14em] text-[#2c2c2c]">
                Email
              </span>
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-4 py-3 font-['Syne'] text-[15px] text-[#151515] outline-none transition focus:bg-white focus:shadow-[3px_3px_0_#111111]"
                placeholder="admin@portfolio.dev"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block font-['Syne'] text-xs font-extrabold uppercase tracking-[0.14em] text-[#2c2c2c]">
                Password
              </span>
              <input
                type="password"
                name="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-4 py-3 font-['Syne'] text-[15px] text-[#151515] outline-none transition focus:bg-white focus:shadow-[3px_3px_0_#111111]"
                placeholder="Your admin password"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex w-full items-center justify-center border-2 border-[#111111] bg-[#9dff00] px-4 py-3 font-['Syne'] text-sm font-extrabold uppercase tracking-[0.18em] text-[#111111] shadow-[4px_4px_0_#111111] transition hover:-translate-y-px hover:bg-[#8ef000] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default AdminLoginPage;
